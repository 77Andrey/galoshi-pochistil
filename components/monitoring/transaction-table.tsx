"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, FilterIcon, DownloadIcon, FileJsonIcon, CheckSquareIcon, SquareIcon } from "lucide-react"
import type { Transaction, RiskLevel, TransactionStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TransactionTableProps {
  transactions: Transaction[]
}

function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
  }
}

function getStatusBadgeColor(status: TransactionStatus): string {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "flagged":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
  }
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get("search") || "")
      setStatusFilter(params.get("status") || "all")
      setRiskFilter(params.get("risk") || "all")
    }
  }, [])

  // Update URL when filters change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (riskFilter !== "all") params.set("risk", riskFilter)
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
      if (window.location.href !== `${window.location.origin}${newUrl}`) {
        router.replace(newUrl)
      }
    }
  }, [searchQuery, statusFilter, riskFilter, pathname, router])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        searchQuery === "" ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.receiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.country.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
      const matchesRisk = riskFilter === "all" || transaction.riskLevel === riskFilter

      return matchesSearch && matchesStatus && matchesRisk
    })
  }, [transactions, searchQuery, statusFilter, riskFilter])

  const rowVirtualizer = useVirtualizer({
    count: filteredTransactions.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 60,
    overscan: 10,
  })

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleExport = (format: "csv" | "json" = "csv") => {
    const dataToExport = filteredTransactions.map((t) => ({
      id: t.id,
      timestamp: t.timestamp.toISOString(),
      amount: t.amount,
      currency: t.currency,
      sender: t.sender,
      receiver: t.receiver,
      status: t.status,
      riskLevel: t.riskLevel,
      riskScore: t.riskScore,
      country: t.country,
      method: t.method,
    }))

    let content: string
    let mimeType: string
    let extension: string

    if (format === "json") {
      content = JSON.stringify(dataToExport, null, 2)
      mimeType = "application/json"
      extension = "json"
    } else {
      content = [
        [
          "ID",
          "Timestamp",
          "Amount",
          "Currency",
          "Sender",
          "Receiver",
          "Status",
          "Risk Level",
          "Risk Score",
          "Country",
          "Method",
        ].join(","),
        ...dataToExport.map((t) =>
          [
            t.id,
            t.timestamp,
            t.amount,
            t.currency,
            t.sender,
            t.receiver,
            t.status,
            t.riskLevel,
            t.riskScore,
            t.country,
            t.method,
          ].join(","),
        ),
      ].join("\n")
      mimeType = "text/csv"
      extension = "csv"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString()}.${extension}`
    a.click()
  }

  const handleBulkAction = (action: string) => {
    const selected = filteredTransactions.filter((t) => selectedIds.has(t.id))
    console.log(`Bulk action "${action}" on ${selected.length} transactions:`, selected)
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, sender, receiver, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-search-input
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("json")}>
              <FileJsonIcon className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length.toLocaleString()} of {transactions.length.toLocaleString()} transactions
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedIds.size} selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("flag")}>
                Flag
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                Reject
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3 sticky top-0 z-10">
          <div className="grid grid-cols-[40px_1fr_1fr_80px_1fr_1fr_100px_80px_80px] gap-4 text-xs font-medium text-muted-foreground">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleSelectAll()
              }}
              className="flex items-center justify-center"
            >
              {selectedIds.size === filteredTransactions.length ? (
                <CheckSquareIcon className="h-4 w-4" />
              ) : (
                <SquareIcon className="h-4 w-4" />
              )}
            </button>
            <div>Transaction ID</div>
            <div>Timestamp</div>
            <div>Amount</div>
            <div>Sender</div>
            <div>Receiver</div>
            <div>Status</div>
            <div>Risk</div>
            <div>Score</div>
          </div>
        </div>
        <div ref={setParentRef} className="h-[600px] overflow-auto">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const transaction = filteredTransactions[virtualRow.index]
              return (
                <div
                  key={transaction.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={cn(
                    "border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors",
                    selectedTransaction?.id === transaction.id && "bg-muted",
                  )}
                >
                  <div
                    className="grid grid-cols-[40px_1fr_1fr_80px_1fr_1fr_100px_80px_80px] gap-4 items-center text-sm cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSelect(transaction.id)
                      }}
                      className="flex items-center justify-center"
                    >
                      {selectedIds.has(transaction.id) ? (
                        <CheckSquareIcon className="h-4 w-4" />
                      ) : (
                        <SquareIcon className="h-4 w-4" />
                      )}
                    </button>
                    <div className="font-mono text-xs">{transaction.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.timestamp.toLocaleString()}
                    </div>
                    <div className="font-medium">
                      {transaction.currency} {transaction.amount.toLocaleString()}
                    </div>
                    <div className="truncate">{transaction.sender}</div>
                    <div className="truncate">{transaction.receiver}</div>
                    <div>
                      <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(transaction.status))}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant="outline" className={cn("text-xs", getRiskBadgeColor(transaction.riskLevel))}>
                        {transaction.riskLevel}
                      </Badge>
                    </div>
                    <div className="font-mono text-xs">{transaction.riskScore}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {selectedTransaction && (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <p className="text-sm text-muted-foreground font-mono">{selectedTransaction.id}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
              Close
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
              <p className="text-sm font-medium">{selectedTransaction.timestamp.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-sm font-medium">
                {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sender</p>
              <p className="text-sm font-medium">{selectedTransaction.sender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Receiver</p>
              <p className="text-sm font-medium">{selectedTransaction.receiver}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Country</p>
              <p className="text-sm font-medium">{selectedTransaction.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Method</p>
              <p className="text-sm font-medium">{selectedTransaction.method}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant="outline" className={getStatusBadgeColor(selectedTransaction.status)}>
                {selectedTransaction.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <Badge variant="outline" className={getRiskBadgeColor(selectedTransaction.riskLevel)}>
                {selectedTransaction.riskLevel} ({selectedTransaction.riskScore})
              </Badge>
            </div>
            {selectedTransaction.flags && selectedTransaction.flags.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-2">Flags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTransaction.flags.map((flag, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

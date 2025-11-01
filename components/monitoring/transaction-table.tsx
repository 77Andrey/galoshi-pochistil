"use client"

import { useState, useMemo, useEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, FilterIcon, DownloadIcon, FileJsonIcon, CheckSquareIcon, SquareIcon } from "lucide-react"
import type { Transaction, RiskLevel, TransactionStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

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
  const { t } = useLanguage()
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
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
      if (window.location.search !== `?${params.toString()}` && params.toString() !== "") {
        window.history.replaceState({}, "", newUrl)
      } else if (params.toString() === "" && window.location.search !== "") {
        window.history.replaceState({}, "", window.location.pathname)
      }
    }
  }, [searchQuery, statusFilter, riskFilter])

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
              placeholder={t.monitoring.searchPlaceholder}
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
                <SelectValue placeholder={t.monitoring.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.monitoring.allStatus}</SelectItem>
                <SelectItem value="pending">{t.status.pending}</SelectItem>
                <SelectItem value="approved">{t.status.approved}</SelectItem>
                <SelectItem value="flagged">{t.status.flagged}</SelectItem>
                <SelectItem value="rejected">{t.status.rejected}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t.monitoring.risk} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.monitoring.allRisk}</SelectItem>
                <SelectItem value="low">{t.risk.low}</SelectItem>
                <SelectItem value="medium">{t.risk.medium}</SelectItem>
                <SelectItem value="high">{t.risk.high}</SelectItem>
                <SelectItem value="critical">{t.risk.critical}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              {t.monitoring.exportCSV}
            </Button>
            <Button variant="outline" onClick={() => handleExport("json")}>
              <FileJsonIcon className="mr-2 h-4 w-4" />
              {t.monitoring.exportJSON}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t.monitoring.showing} {filteredTransactions.length.toLocaleString()} {t.monitoring.of} {transactions.length.toLocaleString()} {t.monitoring.transactions}
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedIds.size} {t.monitoring.selected}</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                {t.monitoring.approve}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("flag")}>
                {t.monitoring.flag}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                {t.monitoring.reject}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                {t.monitoring.clear}
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
            <div>{t.table.transactionId}</div>
            <div>{t.table.timestamp}</div>
            <div>{t.table.amount}</div>
            <div>{t.table.sender}</div>
            <div>{t.table.receiver}</div>
            <div>{t.monitoring.status}</div>
            <div>{t.monitoring.risk}</div>
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
              <h3 className="text-lg font-semibold">{t.monitoring.transactionDetails}</h3>
              <p className="text-sm text-muted-foreground font-mono">{selectedTransaction.id}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
              {t.monitoring.close}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.table.timestamp}</p>
              <p className="text-sm font-medium">{selectedTransaction.timestamp.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.table.amount}</p>
              <p className="text-sm font-medium">
                {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.table.sender}</p>
              <p className="text-sm font-medium">{selectedTransaction.sender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.table.receiver}</p>
              <p className="text-sm font-medium">{selectedTransaction.receiver}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.table.country}</p>
              <p className="text-sm font-medium">{selectedTransaction.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.table.method}</p>
              <p className="text-sm font-medium">{selectedTransaction.method}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.monitoring.status}</p>
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

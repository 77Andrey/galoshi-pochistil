"use client"

import { useState, useMemo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, FilterIcon, DownloadIcon } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

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

  const parentRef = useState<HTMLDivElement | null>(null)[0]

  const rowVirtualizer = useVirtualizer({
    count: filteredTransactions.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 60,
    overscan: 10,
  })

  const handleExport = () => {
    const csv = [
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
      ...filteredTransactions.map((t) =>
        [
          t.id,
          t.timestamp.toISOString(),
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

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString()}.csv`
    a.click()
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
            <Button variant="outline" onClick={handleExport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredTransactions.length.toLocaleString()} of {transactions.length.toLocaleString()} transactions
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
            <div className="col-span-2">Transaction ID</div>
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-2">Sender</div>
            <div className="col-span-2">Receiver</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Risk</div>
            <div className="col-span-1">Score</div>
          </div>
        </div>
        <div
          ref={(node) => {
            if (node) {
              parentRef.current = node
            }
          }}
          className="h-[600px] overflow-auto"
        >
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
                    "border-b border-border px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                    selectedTransaction?.id === transaction.id && "bg-muted",
                  )}
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-2 font-mono text-xs">{transaction.id}</div>
                    <div className="col-span-2 text-xs text-muted-foreground">
                      {transaction.timestamp.toLocaleString()}
                    </div>
                    <div className="col-span-1 font-medium">
                      {transaction.currency} {transaction.amount.toLocaleString()}
                    </div>
                    <div className="col-span-2 truncate">{transaction.sender}</div>
                    <div className="col-span-2 truncate">{transaction.receiver}</div>
                    <div className="col-span-1">
                      <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(transaction.status))}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="col-span-1">
                      <Badge variant="outline" className={cn("text-xs", getRiskBadgeColor(transaction.riskLevel))}>
                        {transaction.riskLevel}
                      </Badge>
                    </div>
                    <div className="col-span-1 font-mono text-xs">{transaction.riskScore}</div>
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

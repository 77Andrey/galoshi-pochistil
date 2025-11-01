"use client"

import { useState, useEffect } from "react"
import { TransactionTable } from "@/components/monitoring/transaction-table"
import { useMockTransactions } from "@/lib/mock-data"
import { useLanguage } from "@/components/language-provider"

export default function MonitoringPage() {
  const [transactions, setTransactions] = useState(useMockTransactions())
  const { t } = useLanguage()

  useEffect(() => {
    setTransactions(useMockTransactions())
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.monitoring.title}</h1>
        <p className="text-muted-foreground mt-1">{t.monitoring.subtitle}</p>
      </div>

      <TransactionTable transactions={transactions} />
    </div>
  )
}

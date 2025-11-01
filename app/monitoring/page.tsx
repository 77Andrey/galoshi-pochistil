import { TransactionTable } from "@/components/monitoring/transaction-table"
import { mockTransactions } from "@/lib/mock-data"

export default function MonitoringPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction Monitoring</h1>
        <p className="text-muted-foreground mt-1">Real-time transaction monitoring and risk assessment</p>
      </div>

      <TransactionTable transactions={mockTransactions} />
    </div>
  )
}

import { MetricCard } from "@/components/dashboard/metric-card"
import { RiskDistribution } from "@/components/dashboard/risk-distribution"
import { TransactionTrend } from "@/components/dashboard/transaction-trend"
import { TopRiskCountries } from "@/components/dashboard/top-risk-countries"
import { mockDashboardMetrics } from "@/lib/mock-data"
import { ActivityIcon, AlertTriangleIcon, DollarSignIcon, SearchIcon, UserCheckIcon } from "lucide-react"

export default function OverviewPage() {
  const metrics = mockDashboardMetrics

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time KYC/AML monitoring and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Transactions"
          value={metrics.totalTransactions.toLocaleString()}
          change={{ value: 12.5, label: "from last month" }}
          icon={ActivityIcon}
          trend="up"
        />
        <MetricCard
          title="Flagged Transactions"
          value={metrics.flaggedTransactions.toLocaleString()}
          change={{ value: -8.2, label: "from last month" }}
          icon={AlertTriangleIcon}
          trend="down"
        />
        <MetricCard
          title="Total Volume"
          value={`$${(metrics.totalVolume / 1000000).toFixed(1)}M`}
          change={{ value: 23.1, label: "from last month" }}
          icon={DollarSignIcon}
          trend="up"
        />
        <MetricCard
          title="Active Investigations"
          value={metrics.activeInvestigations}
          icon={SearchIcon}
          trend="neutral"
        />
        <MetricCard
          title="Pending KYC"
          value={metrics.pendingKYC}
          change={{ value: -15.3, label: "from last month" }}
          icon={UserCheckIcon}
          trend="down"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TransactionTrend data={metrics.transactionTrend} />
        <RiskDistribution data={metrics.riskDistribution} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopRiskCountries data={metrics.topRiskCountries} />
      </div>
    </div>
  )
}

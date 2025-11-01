"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { RiskDistribution } from "@/components/dashboard/risk-distribution"
import { TransactionTrend } from "@/components/dashboard/transaction-trend"
import { TopRiskCountries } from "@/components/dashboard/top-risk-countries"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useMockDashboardMetrics } from "@/lib/mock-data"
import { useLanguage } from "@/components/language-provider"
import { ActivityIcon, AlertTriangleIcon, DollarSignIcon, SearchIcon, UserCheckIcon } from "lucide-react"

export default function OverviewPage() {
  const [metrics, setMetrics] = useState(useMockDashboardMetrics())
  const { t } = useLanguage()

  useEffect(() => {
    setMetrics(useMockDashboardMetrics())
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
        <p className="text-muted-foreground mt-1">{t.dashboard.subtitle}</p>
      </div>

      <QuickActions />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title={t.dashboard.totalTransactions}
          value={metrics.totalTransactions.toLocaleString()}
          change={{ value: 12.5, label: t.common.fromLastMonth }}
          icon={ActivityIcon}
          trend="up"
        />
        <MetricCard
          title={t.dashboard.flaggedTransactions}
          value={metrics.flaggedTransactions.toLocaleString()}
          change={{ value: -8.2, label: t.common.fromLastMonth }}
          icon={AlertTriangleIcon}
          trend="down"
        />
        <MetricCard
          title={t.dashboard.totalVolume}
          value={`$${(metrics.totalVolume / 1000000).toFixed(1)}M`}
          change={{ value: 23.1, label: t.common.fromLastMonth }}
          icon={DollarSignIcon}
          trend="up"
        />
        <MetricCard
          title={t.dashboard.activeInvestigations}
          value={metrics.activeInvestigations}
          icon={SearchIcon}
          trend="neutral"
        />
        <MetricCard
          title={t.dashboard.pendingKYC}
          value={metrics.pendingKYC}
          change={{ value: -15.3, label: t.common.fromLastMonth }}
          icon={UserCheckIcon}
          trend="down"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TransactionTrend 
          data={metrics.transactionTrend} 
          title={t.dashboard.transactionTrend}
          countLabel={t.chart.transactionCount}
          volumeLabel={t.chart.volume}
          loadingText={t.common.loadingChart}
        />
        <RiskDistribution data={metrics.riskDistribution} title={t.dashboard.riskDistribution} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopRiskCountries data={metrics.topRiskCountries} title={t.dashboard.topRiskCountries} />
      </div>
    </div>
  )
}

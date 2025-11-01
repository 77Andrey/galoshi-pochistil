import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  description?: string
}

export function StatCard({ title, value, change, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {change !== undefined && (
          <div className="mt-1 flex items-center text-xs">
            {change > 0 ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-(--color-risk-high)" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-(--color-risk-low)" />
            )}
            <span className={change > 0 ? "text-(--color-risk-high)" : "text-(--color-risk-low)"}>
              {Math.abs(change)}%
            </span>
            <span className="ml-1 text-muted-foreground">vs last period</span>
          </div>
        )}
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

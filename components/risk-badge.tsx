import { Badge } from "@/components/ui/badge"
import type { RiskLevel } from "@/lib/mock-data"

interface RiskBadgeProps {
  level: RiskLevel
  score?: number
}

export function RiskBadge({ level, score }: RiskBadgeProps) {
  const colors = {
    low: "bg-(--color-risk-low) text-white hover:bg-(--color-risk-low)",
    medium: "bg-(--color-risk-medium) text-white hover:bg-(--color-risk-medium)",
    high: "bg-(--color-risk-high) text-white hover:bg-(--color-risk-high)",
    critical: "bg-(--color-risk-critical) text-white hover:bg-(--color-risk-critical)",
  }

  return (
    <Badge className={colors[level]} variant="secondary">
      {level.toUpperCase()}
      {score !== undefined && ` (${score})`}
    </Badge>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TopRiskCountriesProps {
  data: {
    country: string
    count: number
    riskScore: number
  }[]
  title?: string
}

function getRiskColor(score: number): string {
  if (score < 30) return "bg-green-100 text-green-800 border-green-200"
  if (score < 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
  if (score < 85) return "bg-orange-100 text-orange-800 border-orange-200"
  return "bg-red-100 text-red-800 border-red-200"
}

export function TopRiskCountries({ data, title }: TopRiskCountriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Top Risk Countries"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.country} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.country}</p>
                  <p className="text-xs text-muted-foreground">{item.count} transactions</p>
                </div>
              </div>
              <Badge variant="outline" className={cn("font-mono text-xs", getRiskColor(item.riskScore))}>
                {item.riskScore}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

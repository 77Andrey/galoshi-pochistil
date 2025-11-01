"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface RiskDistributionProps {
  data: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

const COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#dc2626",
}

export function RiskDistribution({ data }: RiskDistributionProps) {
  const chartData = [
    { name: "Low", value: data.low, color: COLORS.low },
    { name: "Medium", value: data.medium, color: COLORS.medium },
    { name: "High", value: data.high, color: COLORS.high },
    { name: "Critical", value: data.critical, color: COLORS.critical },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

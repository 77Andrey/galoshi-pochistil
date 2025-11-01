"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface TransactionTrendProps {
  data: {
    date: string
    count: number
    volume: number
  }[]
}

export function TransactionTrend({ data }: TransactionTrendProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    volume: item.volume / 1000000, // Convert to millions
  }))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Transaction Trend (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="date" stroke="#737373" fontSize={12} />
            <YAxis yAxisId="left" stroke="#737373" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#737373" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="#0a0a0a"
              strokeWidth={2}
              name="Transaction Count"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="#737373"
              strokeWidth={2}
              name="Volume (M)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

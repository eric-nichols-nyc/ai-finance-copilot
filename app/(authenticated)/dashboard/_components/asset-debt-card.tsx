"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

const timeRanges = ["1W", "1M", "3M", "YTD", "1Y", "ALL"] as const
type TimeRange = typeof timeRanges[number]

const chartData: Record<TimeRange, Array<{ date: string; assets: number; debt: number }>> = {
  "1W": [
    { date: "Mon", assets: 46500, debt: 12000 },
    { date: "Tue", assets: 46800, debt: 11950 },
    { date: "Wed", assets: 46900, debt: 11900 },
    { date: "Thu", assets: 47000, debt: 11850 },
    { date: "Fri", assets: 47138, debt: 11839 },
  ],
  "1M": [
    { date: "Week 1", assets: 45000, debt: 12200 },
    { date: "Week 2", assets: 45800, debt: 12100 },
    { date: "Week 3", assets: 46500, debt: 12000 },
    { date: "Week 4", assets: 47138, debt: 11839 },
  ],
  "3M": [
    { date: "Sep", assets: 43000, debt: 12800 },
    { date: "Oct", assets: 45000, debt: 12400 },
    { date: "Nov", assets: 47138, debt: 11839 },
  ],
  "YTD": [
    { date: "Jan", assets: 38000, debt: 15000 },
    { date: "Mar", assets: 40000, debt: 14200 },
    { date: "May", assets: 42000, debt: 13500 },
    { date: "Jul", assets: 44000, debt: 12800 },
    { date: "Sep", assets: 45500, debt: 12200 },
    { date: "Nov", assets: 47138, debt: 11839 },
  ],
  "1Y": [
    { date: "Q1", assets: 35000, debt: 16000 },
    { date: "Q2", assets: 39000, debt: 14500 },
    { date: "Q3", assets: 43000, debt: 13000 },
    { date: "Q4", assets: 47138, debt: 11839 },
  ],
  "ALL": [
    { date: "2021", assets: 25000, debt: 20000 },
    { date: "2022", assets: 32000, debt: 17000 },
    { date: "2023", assets: 40000, debt: 14000 },
    { date: "2024", assets: 47138, debt: 11839 },
  ],
}

const chartConfig = {
  assets: {
    label: "Assets",
    color: "hsl(var(--chart-1))",
  },
  debt: {
    label: "Debt",
    color: "hsl(var(--chart-2))",
  },
}

export function AssetDebtCard() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M")
  const data = chartData[selectedRange]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Assets & Debt</CardTitle>
          <Link href="/accounts">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              ACCOUNTS
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs text-muted-foreground">Assets</span>
            <span className="text-2xl font-bold">$47,138</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>4.91%</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs text-muted-foreground">Debt</span>
            <span className="text-2xl font-bold">$11,839</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-red-600">
            <TrendingDown className="h-3 w-3" />
            <span>2.71%</span>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[120px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Line
              type="monotone"
              dataKey="assets"
              stroke="var(--color-assets)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="debt"
              stroke="var(--color-debt)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>

        <div className="flex items-center justify-between text-xs">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${selectedRange === range ? 'bg-accent' : ''}`}
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

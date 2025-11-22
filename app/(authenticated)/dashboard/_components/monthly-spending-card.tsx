"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"

const monthlyData = [
  { day: "1", budgeted: 200, actual: 180 },
  { day: "5", budgeted: 1000, actual: 950 },
  { day: "10", budgeted: 2000, actual: 2100 },
  { day: "15", budgeted: 3000, actual: 3200 },
  { day: "20", budgeted: 4500, actual: 5000 },
  { day: "25", budgeted: 5500, actual: 6100 },
  { day: "30", budgeted: 6120, actual: 6408 },
]

const chartConfig = {
  budgeted: {
    label: "Budgeted",
    color: "hsl(var(--chart-2))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
}

export function MonthlySpendingCard() {
  const overBudget = 288
  const totalBudget = 6120

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monthly spending</CardTitle>
            <div className="mt-2">
              <div className="text-3xl font-bold">${overBudget} over</div>
              <div className="text-sm text-muted-foreground">${totalBudget.toLocaleString()} budgeted</div>
            </div>
          </div>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="gap-1">
              TRANSACTIONS
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="fillBudgeted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-budgeted)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-budgeted)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-actual)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-actual)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `Day ${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <Area
              type="monotone"
              dataKey="budgeted"
              stroke="var(--color-budgeted)"
              fill="url(#fillBudgeted)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--color-actual)"
              fill="url(#fillActual)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

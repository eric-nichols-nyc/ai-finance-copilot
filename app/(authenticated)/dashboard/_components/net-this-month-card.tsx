import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown } from "lucide-react"
import Link from "next/link"

export function NetThisMonthCard() {
  const netAmount = 1204.71
  const percentageChange = 49.67
  const income = 5600.0
  const spend = 4395.29
  const comparisonAmount = 2384.51
  const comparisonPeriod = "Oct 1 - Oct 22 2025"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Net this month</CardTitle>
          <Link href="/cash-flow">
            <Button variant="ghost" size="sm" className="gap-1">
              CASH FLOW
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-green-600">${netAmount.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-green-600">{percentageChange}%</span>
              <span className="text-muted-foreground">
                vs ${comparisonAmount.toFixed(2)} in {comparisonPeriod}
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-muted-foreground">Income</div>
              <div className="font-semibold text-green-600">+${income.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Spend</div>
              <div className="font-semibold text-red-600">-${spend.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

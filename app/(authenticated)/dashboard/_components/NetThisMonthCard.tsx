import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown } from "lucide-react"
import Link from "next/link"

export function NetThisMonthCard() {
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
            <div className="text-3xl font-bold text-green-600">$1,204.71</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingDown className="h-3 w-3" />
              <span>49.67%</span>
              <span className="text-muted-foreground">vs $2,384.51 in Oct 1 - Oct 22 2025</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-muted-foreground">Income</div>
              <div className="font-semibold text-green-600">+$5,600.00</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Spend</div>
              <div className="font-semibold text-red-600">-$4,395.29</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

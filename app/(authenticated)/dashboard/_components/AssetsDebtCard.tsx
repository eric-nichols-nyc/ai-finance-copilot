import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export function AssetsDebtCard() {
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
        {/* Chart placeholder */}
        <div className="h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        {/* Time period buttons */}
        <div className="flex items-center justify-between text-xs">
          <Button variant="ghost" size="sm" className="h-7 px-2">1W</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 bg-accent">1M</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">3M</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">YTD</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">1Y</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">ALL</Button>
        </div>
      </CardContent>
    </Card>
  )
}

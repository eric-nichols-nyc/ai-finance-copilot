import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function MonthlySpendingCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monthly spending</CardTitle>
            <div className="mt-2">
              <div className="text-3xl font-bold">$288 over</div>
              <div className="text-sm text-muted-foreground">$6,120 budgeted</div>
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
        {/* Placeholder for chart - we'll add a proper chart later */}
        <div className="h-48 rounded-lg bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 flex items-end justify-end p-4">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
            $288 over
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

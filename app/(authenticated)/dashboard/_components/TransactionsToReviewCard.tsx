import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export function TransactionsToReviewCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions to review</CardTitle>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="gap-1">
              VIEW ALL
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Transaction items */}
          <div className="text-xs font-semibold text-muted-foreground">YESTERDAY</div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <div>
                <div className="font-medium">Hulu</div>
                <div className="text-sm text-muted-foreground">Chase Credit Card 8959</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-700">SUBSCRIPTIONS</Badge>
              <span className="font-semibold">$11.99</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <div>
                <div className="font-medium">Lyft</div>
                <div className="text-sm text-muted-foreground">Total Checking 2287</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-teal-500/10 text-teal-700">TRANSPORTATION</Badge>
              <span className="font-semibold">$36.56</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-muted-foreground mt-4">THU, NOVEMBER 20</div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <div>
                <div className="font-medium">Sunoco</div>
                <div className="text-sm text-muted-foreground">Total Checking 2287</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-pink-500/10 text-pink-700">CAR</Badge>
              <span className="font-semibold">$133.66</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-muted-foreground mt-4">WED, NOVEMBER 19</div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <div>
                <div className="font-medium">Uber</div>
                <div className="text-sm text-muted-foreground">Total Checking 2287</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-teal-500/10 text-teal-700">TRANSPORTATION</Badge>
              <span className="font-semibold">$101.25</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">4 of 4</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Check className="h-4 w-4" />
              Mark 4 as reviewed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

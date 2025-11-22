import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const transactions = [
  {
    date: "YESTERDAY",
    items: [
      {
        id: 1,
        name: "Hulu",
        account: "Chase Credit Card 8959",
        category: "SUBSCRIPTIONS",
        categoryColor: "bg-purple-500/10 text-purple-700",
        amount: 11.99,
      },
      {
        id: 2,
        name: "Lyft",
        account: "Total Checking 2287",
        category: "TRANSPORTATION",
        categoryColor: "bg-teal-500/10 text-teal-700",
        amount: 36.56,
      },
    ],
  },
  {
    date: "THU, NOVEMBER 20",
    items: [
      {
        id: 3,
        name: "Sunoco",
        account: "Total Checking 2287",
        category: "CAR",
        categoryColor: "bg-pink-500/10 text-pink-700",
        amount: 133.66,
      },
    ],
  },
  {
    date: "WED, NOVEMBER 19",
    items: [
      {
        id: 4,
        name: "Uber",
        account: "Total Checking 2287",
        category: "TRANSPORTATION",
        categoryColor: "bg-teal-500/10 text-teal-700",
        amount: 101.25,
      },
    ],
  },
]

const totalTransactions = transactions.reduce((acc, group) => acc + group.items.length, 0)

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
          {transactions.map((group) => (
            <div key={group.date}>
              <div className="text-xs font-semibold text-muted-foreground mb-2">{group.date}</div>
              {group.items.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.account}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={transaction.categoryColor}>
                      {transaction.category}
                    </Badge>
                    <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">
              {totalTransactions} of {totalTransactions}
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              <Check className="h-4 w-4" />
              Mark {totalTransactions} as reviewed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

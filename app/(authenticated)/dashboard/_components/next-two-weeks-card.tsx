import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const recurringPayments = [
  {
    date: "Nov 28th",
    name: "Netflix",
    frequency: "Monthly",
    account: "Chase Credit Card 8959",
    amount: 12.99,
    icon: "📱"
  },
  {
    date: "Dec 1st",
    name: "Spotify",
    frequency: "Monthly",
    account: "Chase Credit Card 8959",
    amount: 9.99,
    icon: "🎵"
  },
  {
    date: "Dec 4th",
    name: "Property Payment Rent Ca",
    frequency: "Monthly",
    account: "Total Checking 2287",
    amount: 1984.00,
    icon: "🏠"
  },
  {
    date: "Dec 5th",
    name: "Car Payment",
    frequency: "Monthly",
    account: "Adv Plus Banking 2341",
    amount: 355.00,
    icon: "🚗"
  },
  {
    date: "Dec 5th",
    name: "Nannacheap",
    frequency: "Monthly",
    account: "Cash Rewards 6112",
    amount: 14.00,
    icon: "💻"
  },
  {
    date: "Dec 5th",
    name: "Rayne Water Ca",
    frequency: "Monthly",
    account: "Adv Plus Banking 2341",
    amount: 38.00,
    icon: "💧"
  },
]

export function NextTwoWeeksCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Next two weeks</CardTitle>
          <Link href="/recurrings">
            <Button variant="ghost" size="sm" className="gap-1">
              RECURRINGS
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recurringPayments.map((item, idx) => (
            <div
              key={`${item.date}-${item.name}-${idx}`}
              className="flex items-start justify-between text-sm border-b pb-2 last:border-0"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                    <span className="text-xs">{item.icon}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.frequency}</div>
                  <div className="text-xs text-muted-foreground">{item.account}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{item.date}</div>
                <div className="font-semibold">${item.amount.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

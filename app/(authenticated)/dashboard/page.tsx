import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, TrendingUp, TrendingDown, Check } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* First Row: Monthly Spending & Assets/Debt */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Monthly Spending Card */}
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

        {/* Assets & Debt Card */}
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
      </div>

      {/* Second Row: Transactions to Review & Top Categories */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Transactions to Review Card */}
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

        {/* Top Categories Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top categories</CardTitle>
              <Link href="/categories">
                <Button variant="ghost" size="sm" className="gap-1">
                  VIEW ALL
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Home", spent: 2022, budget: 2050, color: "bg-green-500" },
                { name: "Car & Transportation", spent: 1321, budget: 1970, color: "bg-red-500" },
                { name: "Entertainment", spent: 680, budget: 1200, color: "bg-red-500" },
                { name: "Shopping", spent: 177, budget: 1250, color: "bg-green-500" },
                { name: "Food & Drink", spent: 168, budget: 1450, color: "bg-green-500" },
                { name: "Subscriptions", spent: 35, budget: 1200, color: "bg-green-500" },
              ].map((category, idx) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{idx + 1}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${category.spent}</span>
                      <span className="text-xs text-muted-foreground">${category.budget}</span>
                    </div>
                  </div>
                  <Progress value={(category.spent / category.budget) * 100} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Net This Month, Next Two Weeks, Goals */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Net This Month Card */}
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

        {/* Next Two Weeks Card */}
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
              {[
                { date: "Nov 28th", name: "Netflix", frequency: "Monthly", account: "Chase Credit Card 8959", amount: 12.99 },
                { date: "Dec 1st", name: "Spotify", frequency: "Monthly", account: "Chase Credit Card 8959", amount: 9.99 },
                { date: "Dec 4th", name: "Property Payment Rent Ca", frequency: "Monthly", account: "Total Checking 2287", amount: 1984.00 },
                { date: "Dec 5th", name: "Car Payment", frequency: "Monthly", account: "Adv Plus Banking 2341", amount: 355.00 },
                { date: "Dec 5th", name: "Nannacheap", frequency: "Monthly", account: "Cash Rewards 6112", amount: 14.00 },
                { date: "Dec 5th", name: "Rayne Water Ca", frequency: "Monthly", account: "Adv Plus Banking 2341", amount: 38.00 },
              ].map((item) => (
                <div key={`${item.date}-${item.name}`} className="flex items-start justify-between text-sm border-b pb-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs">📱</span>
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

        {/* Goals Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Goals</CardTitle>
              <Link href="/goals">
                <Button variant="ghost" size="sm" className="gap-1">
                  ALL GOALS
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-sm">No goals yet</p>
                <Link href="/goals">
                  <Button variant="outline" size="sm" className="mt-4">
                    Create a goal
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const categories = [
  { name: "Home", spent: 2022, budget: 2050, color: "bg-green-500" },
  { name: "Car & Transportation", spent: 1321, budget: 1970, color: "bg-red-500" },
  { name: "Entertainment", spent: 680, budget: 1200, color: "bg-red-500" },
  { name: "Shopping", spent: 177, budget: 1250, color: "bg-green-500" },
  { name: "Food & Drink", spent: 168, budget: 1450, color: "bg-green-500" },
  { name: "Subscriptions", spent: 35, budget: 1200, color: "bg-green-500" },
]

export function TopCategoriesCard() {
  return (
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
          {categories.map((category, idx) => (
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
  )
}

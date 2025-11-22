import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function GoalsCard() {
  return (
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
  )
}

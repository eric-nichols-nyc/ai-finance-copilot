import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type UpcomingRecurring = {
  id: string
  name: string
  amount: number
  frequency: string
  nextDueDate: Date
  account: {
    name: string
  }
  category: {
    name: string
  }
}

type RecurringAccountsListProps = {
  upcomingRecurring: UpcomingRecurring[]
}

export function RecurringAccountsList({ upcomingRecurring }: RecurringAccountsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Monthly Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingRecurring.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recurring payments found</p>
        ) : (
          <div className="space-y-4">
            {upcomingRecurring.map((recurring) => (
              <div key={recurring.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{recurring.name}</p>
                  <p className="text-sm text-muted-foreground">{recurring.category.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {recurring.frequency} • Next: {new Date(recurring.nextDueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${recurring.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

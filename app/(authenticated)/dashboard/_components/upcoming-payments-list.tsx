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

type UpcomingPaymentsListProps = {
  upcomingRecurring: UpcomingRecurring[]
}

export function UpcomingPaymentsList({ upcomingRecurring }: UpcomingPaymentsListProps) {
  // Sort upcoming payments by due date (earliest first)
  const sortedPayments = [...upcomingRecurring].sort((a, b) => {
    return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming payments</p>
        ) : (
          <div className="space-y-4">
            {sortedPayments.map((payment) => (
              <div key={payment.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">{payment.account.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(payment.nextDueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${payment.amount.toLocaleString('en-US', {
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

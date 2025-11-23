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

type RecurringPaymentsProps = {
  upcomingRecurring: UpcomingRecurring[]
}

export function RecurringPayments({ upcomingRecurring }: RecurringPaymentsProps) {
  // Sum up all upcoming recurring payment amounts
  const totalRecurring = upcomingRecurring.reduce((sum, recurring) => {
    return sum + recurring.amount
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recurring Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          ${totalRecurring.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  )
}

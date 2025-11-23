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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Recurring Payments</h3>
      <p className="text-3xl font-bold">
        ${totalRecurring.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

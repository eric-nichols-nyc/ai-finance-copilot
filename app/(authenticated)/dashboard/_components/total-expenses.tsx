import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Account } from '@/types'

type TotalExpensesProps = {
  accounts: Account[]
}

export function TotalExpenses({ accounts }: TotalExpensesProps) {
  // Filter out CHECKING and SAVINGS accounts
  const expenseAccounts = accounts.filter(
    (account) => account.type !== 'CHECKING' && account.type !== 'SAVINGS'
  )

  // Calculate total expenses from remaining accounts (CREDIT_CARD, LOAN, INVESTMENT)
  // Use absolute value since debts are stored as negative numbers
  const totalExpenses = expenseAccounts.reduce((sum, account) => {
    return sum + Math.abs(account.balance)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  )
}

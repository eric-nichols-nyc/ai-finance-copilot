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
  const totalExpenses = expenseAccounts.reduce((sum, account) => {
    return sum + account.balance
  }, 0)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
      <p className="text-3xl font-bold">
        ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

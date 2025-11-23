import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Account } from '@/types'

type LoanPaymentProps = {
  accounts: Account[]
}

export function LoanPayment({ accounts }: LoanPaymentProps) {
  // Filter accounts where type is LOAN
  const loanAccounts = accounts.filter(
    (account) => account.type === 'LOAN'
  )

  // Calculate total loan balances
  const totalLoanPayments = loanAccounts.reduce((sum, account) => {
    return sum + account.balance
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Loan Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          ${totalLoanPayments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  )
}

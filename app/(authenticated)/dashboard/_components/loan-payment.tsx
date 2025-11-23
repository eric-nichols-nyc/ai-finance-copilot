import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type LoanPaymentProps = {
  accounts: {
    id:string;
    name:string;
    type:string;
    balance:number;
  }[]
}

export function LoanPayment({ accounts }: LoanPaymentProps) {
  // Filter accounts where type is LOAN
  const loanAccounts = accounts.filter(
    (account) => account.type === 'LOAN'
  )

  // Calculate total loan balances
  // Use absolute value since loans are stored as negative numbers (debts)
  const totalLoanPayments = loanAccounts.reduce((sum, account) => {
    return sum + Math.abs(account.balance)
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

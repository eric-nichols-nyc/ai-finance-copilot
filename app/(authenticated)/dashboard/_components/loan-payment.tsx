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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Loan Payments</h3>
      <p className="text-3xl font-bold">
        ${totalLoanPayments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

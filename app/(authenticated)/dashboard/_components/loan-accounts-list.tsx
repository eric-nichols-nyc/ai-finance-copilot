import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type LoanAccountsListProps = {
  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
  }[]
}

export function LoanAccountsList({ accounts }: LoanAccountsListProps) {
  // Filter accounts where type is LOAN
  const loanAccounts = accounts.filter(
    (account) => account.type === 'LOAN'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        {loanAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No loan accounts found</p>
        ) : (
          <div className="space-y-4">
            {loanAccounts.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{loan.name}</p>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${Math.abs(loan.balance).toLocaleString('en-US', {
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

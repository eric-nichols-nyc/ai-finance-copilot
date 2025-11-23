import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Account } from '@/types'

type CreditCardsProps = {
  accounts: Account[]
}

export function CreditCards({ accounts }: CreditCardsProps) {
  // Filter accounts where type is CREDIT_CARD
  const creditCardAccounts = accounts.filter(
    (account) => account.type === 'CREDIT_CARD'
  )

  // Calculate total credit card balances
  const totalCreditCards = creditCardAccounts.reduce((sum, account) => {
    return sum + account.balance
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Credit Cards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          ${totalCreditCards.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  )
}

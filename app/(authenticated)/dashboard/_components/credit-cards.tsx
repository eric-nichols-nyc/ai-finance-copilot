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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Credit Cards</h3>
      <p className="text-3xl font-bold">
        ${totalCreditCards.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

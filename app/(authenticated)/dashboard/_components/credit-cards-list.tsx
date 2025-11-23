import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type CreditCardsListProps = {
  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
  }[]
}

export function CreditCardsList({ accounts }: CreditCardsListProps) {
  // Filter accounts where type is CREDIT_CARD
  const creditCardAccounts = accounts.filter(
    (account) => account.type === 'CREDIT_CARD'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Cards</CardTitle>
      </CardHeader>
      <CardContent>
        {creditCardAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No credit cards found</p>
        ) : (
          <div className="space-y-4">
            {creditCardAccounts.map((card) => (
              <div key={card.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{card.name}</p>
                  <p className="text-sm text-muted-foreground">Balance</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${Math.abs(card.balance).toLocaleString('en-US', {
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

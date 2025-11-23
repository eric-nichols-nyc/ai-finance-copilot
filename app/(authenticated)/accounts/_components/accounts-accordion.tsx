'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  creditLimit?: number
}

type AccountsAccordionProps = {
  accounts: Account[]
  onAccountSelect: (accountId: string) => void
  selectedAccountId?: string
}

export function AccountsAccordion({
  accounts,
  onAccountSelect,
  selectedAccountId,
}: AccountsAccordionProps) {
  // Group accounts by category
  const creditCards = accounts.filter((a) => a.type === 'CREDIT_CARD')
  const depository = accounts.filter((a) => ['CHECKING', 'SAVINGS'].includes(a.type))
  const investments = accounts.filter((a) => a.type === 'INVESTMENT')

  // Mock sparkline data - in a real app, this would be historical data
  const generateSparklineData = (balance: number, trend: 'up' | 'down') => {
    const data = []
    const variance = balance * 0.05
    for (let i = 0; i < 10; i++) {
      const randomVariance = Math.random() * variance
      const value = trend === 'up'
        ? balance * 0.9 + (i * variance / 10) + randomVariance
        : balance * 1.1 - (i * variance / 10) + randomVariance
      data.push({ value })
    }
    return data
  }

  const AccountItem = ({ account, index }: { account: Account; index: number }) => {
    const isSelected = selectedAccountId === account.id
    const trend = Math.random() > 0.5 ? 'up' : 'down'
    const percentage = (Math.random() * 10).toFixed(2)
    const sparklineData = generateSparklineData(account.balance, trend)
    const isCredit = account.type === 'CREDIT_CARD'
    const utilization = isCredit && account.creditLimit
      ? ((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(2)
      : null

    return (
      <div
        key={account.id}
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-accent' : 'hover:bg-accent/50'
        }`}
        onClick={() => onAccountSelect(account.id)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
            account.type === 'CREDIT_CARD' ? 'bg-blue-500' :
            account.type === 'CHECKING' ? 'bg-emerald-500' :
            account.type === 'SAVINGS' ? 'bg-amber-500' :
            account.type === 'INVESTMENT' ? 'bg-purple-500' : 'bg-gray-500'
          }`}>
            {account.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{account.name}</p>
            {utilization && (
              <p className="text-xs text-muted-foreground">{utilization}% utilized</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={80} height={30}>
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={trend === 'up' ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-right min-w-[120px]">
            <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {percentage}%
            </div>
            <p className="font-bold mt-1">
              ${Math.abs(account.balance).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Accordion type="multiple" defaultValue={['credit-cards', 'depository', 'investments']} className="w-full">
          {creditCards.length > 0 && (
            <AccordionItem value="credit-cards">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Credit cards</span>
                  <span className="text-sm text-muted-foreground">{creditCards.length} accounts</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {creditCards.map((account, index) => (
                    <AccountItem key={account.id} account={account} index={index} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {depository.length > 0 && (
            <AccordionItem value="depository">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Depository</span>
                  <span className="text-sm text-muted-foreground">{depository.length} accounts</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {depository.map((account, index) => (
                    <AccountItem key={account.id} account={account} index={index} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {investments.length > 0 && (
            <AccordionItem value="investments">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Investments</span>
                  <span className="text-sm text-muted-foreground">{investments.length} accounts</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {investments.map((account, index) => (
                    <AccountItem key={account.id} account={account} index={index} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  )
}

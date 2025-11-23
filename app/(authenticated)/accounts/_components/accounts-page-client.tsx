'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TotalAccountsChart } from './total-accounts-chart'
import { AccountsAccordion } from './accounts-accordion'
import { AccountDetailChart } from './account-detail-chart'
import { AccountMonthlyList } from './account-monthly-list'
import { AccountsDebugger } from './accounts-debugger'
import { AddAccountModal } from './add-account-modal'
import { Button } from '@/components/ui/button'

type Transaction = {
  id: string
  amount: number
  description: string | null
  date: Date
  type: string
}

type Account = {
  id: string
  name: string
  type: string
  balance: number
  creditLimit?: number
  apr?: number
  transactions: Transaction[]
}

type AccountsPageClientProps = {
  accounts: Account[]
}

export function AccountsPageClient({ accounts }: AccountsPageClientProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    accounts.length > 0 ? accounts[0].id : undefined
  )

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || null

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your financial accounts
          </p>
        </div>
        <AddAccountModal>
          <Button size="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </AddAccountModal>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col gap-6">
          {/* Top: Total Accounts Chart */}
          <TotalAccountsChart accounts={accounts} />

          {/* Bottom: Accounts Accordion */}
          <AccountsAccordion
            accounts={accounts}
            onAccountSelect={setSelectedAccountId}
            selectedAccountId={selectedAccountId}
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          {/* Top: Account Detail Chart */}
          <AccountDetailChart account={selectedAccount} />

          {/* Bottom: Monthly Transactions List */}
          <AccountMonthlyList account={selectedAccount} />
        </div>
      </div>

      {/* Debug Component (Development Only) */}
      <AccountsDebugger data={{ accounts }} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Trash2, XCircle } from 'lucide-react'
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

  const handleDeleteAccount = (accountId: string) => {
    // TODO: Implement delete account functionality
    console.log('Delete account:', accountId)
  }

  const handleCloseAccount = (accountId: string) => {
    // TODO: Implement close account functionality
    console.log('Close account:', accountId)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Accounts</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your financial accounts
        </p>
      </div>

      {/* Split Layout with Center Border */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col gap-6">
          {/* Add Account Button */}
          <AddAccountModal>
            <Button size="default" className="gap-2 w-full lg:w-auto">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </AddAccountModal>

          {/* Total Accounts Chart */}
          <TotalAccountsChart accounts={accounts} />

          {/* Accounts Accordion */}
          <AccountsAccordion
            accounts={accounts}
            onAccountSelect={setSelectedAccountId}
            selectedAccountId={selectedAccountId}
          />
        </div>

        {/* Right Panel with Left Border */}
        <div className="flex flex-col gap-6 lg:border-l lg:pl-6">
          {/* Account Actions */}
          {selectedAccount && (
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleCloseAccount(selectedAccount.id)}
              >
                <XCircle className="h-4 w-4" />
                Close Account
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => handleDeleteAccount(selectedAccount.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Account Detail Chart */}
          <AccountDetailChart account={selectedAccount} />

          {/* Monthly Transactions List */}
          <AccountMonthlyList account={selectedAccount} />
        </div>
      </div>

      {/* Debug Component (Development Only) */}
      <AccountsDebugger data={{ accounts }} />
    </div>
  )
}

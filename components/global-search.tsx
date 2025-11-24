'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearch } from '@/lib/search-context'
import { useCmdK } from '@/hooks/use-keyboard-shortcut'
import { useSearchResults } from '@/hooks/use-search-results'
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Wallet,
  Tag,
  RefreshCw,
  PieChart,
  Settings,
  HelpCircle,
  Plus,
  Clock,
  DollarSign,
  Calendar,
  Loader2,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/expenseUtils'

// Quick navigation actions
const navigationActions = [
  { id: 'nav-dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'nav-transactions', label: 'Transactions', icon: CreditCard, href: '/transactions' },
  { id: 'nav-cash-flow', label: 'Cash Flow', icon: TrendingUp, href: '/cash-flow' },
  { id: 'nav-accounts', label: 'Accounts', icon: Wallet, href: '/accounts' },
  { id: 'nav-categories', label: 'Categories', icon: Tag, href: '/categories' },
  { id: 'nav-recurring', label: 'Recurring Charges', icon: RefreshCw, href: '/recurrings' },
  { id: 'nav-budgets', label: 'Budgets', icon: PieChart, href: '/budgets' },
  { id: 'nav-analytics', label: 'Analytics', icon: PieChart, href: '/analytics' },
]

const utilityActions = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/help' },
]

const createActions = [
  { id: 'create-transaction', label: 'New Transaction', icon: Plus, action: 'new-transaction' },
  { id: 'create-account', label: 'New Account', icon: Plus, action: 'new-account' },
]

export function GlobalSearch() {
  const router = useRouter()
  const { isOpen, query, recentSearches, closeSearch, setQuery, addRecentSearch } = useSearch()

  // Fetch search results
  const { results, isLoading, hasResults } = useSearchResults({
    query,
    enabled: isOpen,
  })

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useCmdK(() => {
    // Toggle search open/close
    if (isOpen) {
      closeSearch()
    } else {
      // Open search is handled by SearchTrigger or this component
      // We'll let the parent component handle opening
    }
  })

  // Handle navigation
  const handleNavigate = (href: string) => {
    if (query.trim()) {
      addRecentSearch(query)
    }
    router.push(href)
    closeSearch()
  }

  // Filter navigation actions based on query (only show when no search query)
  const showQuickActions = !query || query.length < 2
  const filteredNavigation = showQuickActions
    ? navigationActions.filter((action) =>
        action.label.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const filteredUtilities = showQuickActions
    ? utilityActions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()))
    : []

  const filteredCreate = showQuickActions
    ? createActions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()))
    : []

  // Show recent searches when no query
  const showRecentSearches = !query && recentSearches.length > 0

  // Check if we have any results
  const hasAnyResults =
    hasResults ||
    filteredNavigation.length > 0 ||
    filteredUtilities.length > 0 ||
    filteredCreate.length > 0

  return (
    <CommandDialog open={isOpen} onOpenChange={closeSearch}>
      <CommandInput
        placeholder="Search transactions, accounts, recurring charges..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Loading State */}
        {isLoading && query.length >= 2 && (
          <div className="py-6 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && query.length >= 2 && !hasAnyResults && (
          <CommandEmpty>
            <div className="py-6 text-center text-sm">
              <p className="text-muted-foreground mb-2">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-muted-foreground">
                Try searching for transactions, accounts, or categories
              </p>
            </div>
          </CommandEmpty>
        )}

        {/* Recent Searches */}
        {showRecentSearches && (
          <>
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search) => (
                <CommandItem
                  key={search}
                  value={search}
                  onSelect={() => {
                    setQuery(search)
                  }}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Transaction Results */}
        {!isLoading && results.transactions.length > 0 && (
          <>
            <CommandGroup heading={`Transactions (${results.transactions.length})`}>
              {results.transactions.map((transaction) => (
                <CommandItem
                  key={transaction.id}
                  value={`transaction-${transaction.id}`}
                  onSelect={() => handleNavigate(`/transactions?id=${transaction.id}`)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {transaction.description || 'No description'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transaction.account.name} • {transaction.category?.name || 'Uncategorized'} •{' '}
                        {formatDate(new Date(transaction.date))}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {formatCurrency(Number(transaction.amount))}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Account Results */}
        {!isLoading && results.accounts.length > 0 && (
          <>
            <CommandGroup heading={`Accounts (${results.accounts.length})`}>
              {results.accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={`account-${account.id}`}
                  onSelect={() => handleNavigate(`/accounts?id=${account.id}`)}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{account.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {account.type.replace(/_/g, ' ').toLowerCase()}
                        {account.creditLimit && ` • Limit: ${formatCurrency(Number(account.creditLimit))}`}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(account.balance))}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Recurring Charges Results */}
        {!isLoading && results.recurring.length > 0 && (
          <>
            <CommandGroup heading={`Recurring Charges (${results.recurring.length})`}>
              {results.recurring.map((recurring) => (
                <CommandItem
                  key={recurring.id}
                  value={`recurring-${recurring.id}`}
                  onSelect={() => handleNavigate(`/recurrings?id=${recurring.id}`)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{recurring.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {recurring.frequency} • {recurring.category.name} • Next:{' '}
                        {formatDate(new Date(recurring.nextDueDate))}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(recurring.amount))}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Category Results */}
        {!isLoading && results.categories.length > 0 && (
          <>
            <CommandGroup heading={`Categories (${results.categories.length})`}>
              {results.categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={`category-${category.id}`}
                  onSelect={() => handleNavigate(`/categories?id=${category.id}`)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {category._count.transactions} transactions
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Budget Results */}
        {!isLoading && results.budgets.length > 0 && (
          <>
            <CommandGroup heading={`Budgets (${results.budgets.length})`}>
              {results.budgets.map((budget) => (
                <CommandItem
                  key={budget.id}
                  value={`budget-${budget.id}`}
                  onSelect={() => handleNavigate(`/budgets?id=${budget.id}`)}
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {budget.category?.name || 'Overall Budget'}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {budget.period}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(budget.amount))}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Quick Actions (only shown when no search query) */}
        {filteredNavigation.length > 0 && (
          <CommandGroup heading="Navigate">
            {filteredNavigation.map((action) => {
              const Icon = action.icon
              return (
                <CommandItem
                  key={action.id}
                  value={action.label}
                  onSelect={() => handleNavigate(action.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {action.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        {filteredCreate.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Create">
              {filteredCreate.map((action) => {
                const Icon = action.icon
                return (
                  <CommandItem
                    key={action.id}
                    value={action.label}
                    onSelect={() => {
                      console.log('Action:', action.action)
                      closeSearch()
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}

        {filteredUtilities.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Utilities">
              {filteredUtilities.map((action) => {
                const Icon = action.icon
                return (
                  <CommandItem
                    key={action.id}
                    value={action.label}
                    onSelect={() => handleNavigate(action.href)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

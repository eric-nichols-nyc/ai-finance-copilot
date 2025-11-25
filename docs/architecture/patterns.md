# Component and Code Patterns

This document catalogs reusable patterns used throughout the AI Finance Copilot application.

## Table of Contents

- [Layout Patterns](#layout-patterns)
- [Component Patterns](#component-patterns)
- [Data Fetching Patterns](#data-fetching-patterns)
- [Form Patterns](#form-patterns)
- [Chart Patterns](#chart-patterns)
- [Error Handling Patterns](#error-handling-patterns)

---

## Layout Patterns

### Pattern 1: Split Layout (Accounts & Recurrings)

**Use case:** List/detail view with persistent left panel and dynamic right panel

**Structure:**
```
┌────────────────┬──────────────────────────┐
│                │                          │
│   Left Panel   │     Right Panel          │
│   (Accordion)  │     (Dynamic Routes)     │
│                │                          │
│   • Item 1     │     [Detail View]        │
│   • Item 2     │                          │
│   • Item 3     │     Shows content based  │
│                │     on selected item     │
│                │                          │
└────────────────┴──────────────────────────┘
```

**Implementation:**

**File:** `app/(authenticated)/accounts/layout.tsx`

```typescript
export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Persistent */}
      <div className="w-80 border-r overflow-y-auto">
        <AccountsAccordion />
      </div>

      {/* Right Panel - Dynamic */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
```

**Left Panel (Accordion):**
```typescript
// components/accounts/accounts-accordion.tsx
'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useAccounts } from '@/hooks/use-accounts'

export function AccountsAccordion() {
  const { data: accounts } = useAccounts(userId)

  // Group accounts by type
  const grouped = groupBy(accounts, 'type')

  return (
    <Accordion type="multiple" defaultValue={['credit-cards']}>
      <AccordionItem value="credit-cards">
        <AccordionTrigger>Credit Cards</AccordionTrigger>
        <AccordionContent>
          {grouped.CREDIT_CARD?.map(account => (
            <AccountItem key={account.id} account={account} />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="bank-accounts">
        <AccordionTrigger>Bank Accounts</AccordionTrigger>
        <AccordionContent>
          {grouped.CHECKING?.map(account => (
            <AccountItem key={account.id} account={account} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

**Right Panel (Dynamic Route):**
```typescript
// app/(authenticated)/accounts/[accountId]/page.tsx
export default function AccountDetailPage({
  params,
}: {
  params: { accountId: string }
}) {
  const { data: account } = useAccount(params.accountId)

  return (
    <div className="p-6">
      <AccountHeader account={account} />
      <BalanceHistoryChart accountId={params.accountId} />
      <TransactionsList accountId={params.accountId} />
    </div>
  )
}
```

**When to use:**
- Feature with list of items and detail view
- Need persistent navigation (left panel stays visible)
- Mobile: collapse to single view with toggle

**Used in:**
- `/accounts` - Account management
- `/recurrings` - Recurring payments

---

### Pattern 2: Sidebar Layout (Main App)

**Use case:** App-wide navigation with content area

**Structure:**
```
┌──────────┬────────────────────────────────┐
│          │        Header                  │
│          ├────────────────────────────────┤
│  Sidebar │                                │
│          │                                │
│  Nav     │        Page Content            │
│  Items   │                                │
│          │                                │
│  Account │                                │
│  Links   │                                │
│          │                                │
└──────────┴────────────────────────────────┘
```

**Implementation:**

**File:** `app/(authenticated)/layout.tsx`

```typescript
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
```

**Sidebar Component:**
```typescript
// components/app-sidebar.tsx
import { Sidebar, SidebarContent, SidebarGroup } from '@/components/ui/sidebar'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/transactions">Transactions</Link>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Accounts List */}
        <SidebarGroup>
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <AccountsList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

---

## Component Patterns

### Pattern 3: Metric Card

**Use case:** Display single metric with title and value

**Example:**
```typescript
// components/dashboard/metric-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={cn(
            "text-sm mt-2",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Usage:**
```typescript
<MetricCard
  title="Total Expenses"
  value={formatCurrency(2450.32)}
  subtitle="This month"
  trend={{ value: 12, isPositive: false }}
/>
```

---

### Pattern 4: Data Table with Actions

**Use case:** Display list of items with row actions

**Example:**
```typescript
// components/transactions/transactions-table.tsx
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              <Badge style={{ backgroundColor: transaction.category.color }}>
                {transaction.category.name}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

### Pattern 5: Dialog Form

**Use case:** Modal form for creating/editing entities

**Example:**
```typescript
// components/transactions/transaction-dialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TransactionForm } from './transaction-form'

export function TransactionDialog() {
  const [open, setOpen] = useState(false)

  async function onSubmit(data: TransactionInput) {
    try {
      await createTransaction(data)
      setOpen(false)
      toast.success('Transaction created')
    } catch (error) {
      toast.error('Failed to create transaction')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Add a new income or expense transaction.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
```

---

## Data Fetching Patterns

### Pattern 6: Custom Hook with React Query

**Use case:** Reusable data fetching logic

**Example:**
```typescript
// hooks/use-accounts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAccounts, createAccount } from '@/actions/accounts'

export function useAccounts(userId: string) {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => getAccounts(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateAccount(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['accounts', userId])
      queryClient.invalidateQueries(['dashboard', userId])
    },
  })
}
```

**Usage:**
```typescript
function AccountsList() {
  const { data: accounts, isLoading, error } = useAccounts(userId)
  const createMutation = useCreateAccount(userId)

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  async function handleCreate(data: AccountInput) {
    await createMutation.mutateAsync(data)
  }

  return <div>{/* render accounts */}</div>
}
```

---

### Pattern 7: Optimistic Updates

**Use case:** Instant UI feedback while mutation is processing

**Example:**
```typescript
export function useDeleteTransaction(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,
    onMutate: async (transactionId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['transactions', userId])

      // Snapshot current value
      const previousTransactions = queryClient.getQueryData(['transactions', userId])

      // Optimistically update
      queryClient.setQueryData(['transactions', userId], (old: Transaction[]) =>
        old.filter(t => t.id !== transactionId)
      )

      // Return context with snapshot
      return { previousTransactions }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['transactions', userId],
        context?.previousTransactions
      )
      toast.error('Failed to delete transaction')
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries(['transactions', userId])
    },
  })
}
```

---

## Form Patterns

### Pattern 8: Server Action Form

**Use case:** Form that calls a server action directly

**Example:**
```typescript
// components/transactions/transaction-form.tsx
'use client'

import { createTransaction } from '@/actions/transactions/create-transaction'
import { transactionSchema } from '@/lib/validations/transaction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export function TransactionForm() {
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: 'EXPENSE',
      date: new Date(),
    },
  })

  async function onSubmit(data: TransactionInput) {
    try {
      await createTransaction(data)
      toast.success('Transaction created')
      form.reset()
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        error.errors.forEach(err => {
          form.setError(err.path[0] as any, { message: err.message })
        })
      } else {
        toast.error('Something went wrong')
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create Transaction'}
        </Button>
      </form>
    </Form>
  )
}
```

---

## Chart Patterns

### Pattern 9: Balance History Chart with Time Periods

**Use case:** Line chart with time period selector (1W, 1M, 3M, YTD, 1Y, ALL)

**Example:**
```typescript
// components/accounts/balance-history-chart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'

type TimePeriod = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL'

export function BalanceHistoryChart({ accountId }: { accountId: string }) {
  const [period, setPeriod] = useState<TimePeriod>('1M')

  const { data: balanceHistory } = useQuery({
    queryKey: ['balance-history', accountId, period],
    queryFn: () => getBalanceHistory(accountId, period),
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Balance History</CardTitle>
          <div className="flex gap-1">
            {(['1W', '1M', '3M', 'YTD', '1Y', 'ALL'] as TimePeriod[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => formatDateShort(date)}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(date) => formatDate(date)}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

---

## Error Handling Patterns

### Pattern 10: Error Boundary

**Use case:** Catch React errors and show fallback UI

**Example:**
```typescript
// components/error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                We're sorry, but something unexpected happened.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => this.setState({ hasError: false, error: undefined })}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Usage:**
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <TransactionsList />
</ErrorBoundary>
```

---

### Pattern 11: Loading States

**Use case:** Show skeleton while data is loading

**Example:**
```typescript
// components/ui/skeleton.tsx is provided by shadcn

// components/accounts/account-card-skeleton.tsx
export function AccountCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  )
}

// Usage in component
function AccountsList() {
  const { data: accounts, isLoading } = useAccounts(userId)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AccountCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
```

---

## Utility Patterns

### Pattern 12: Currency Formatting

**File:** `lib/utils.ts`

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Usage
<div>{formatCurrency(1234.56)}</div>  // $1,234.56
```

### Pattern 13: Date Formatting

**File:** `lib/utils.ts`

```typescript
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Usage
<div>{formatDate(transaction.date)}</div>        // November 25, 2025
<div>{formatDateShort(transaction.date)}</div>   // Nov 25
```

### Pattern 14: Conditional Classes (cn utility)

**File:** `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  "rounded-lg p-4",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Content
</div>
```

---

## Best Practices Summary

### Component Organization

1. **Server Components by default** - Only use 'use client' when necessary
2. **Colocate related components** - Keep feature components together
3. **Extract reusable patterns** - Move common patterns to shared components

### Data Fetching

1. **Use custom hooks** - Wrap React Query logic in custom hooks
2. **Centralize query keys** - Use consistent naming: `['resource', ...ids]`
3. **Invalidate strategically** - Invalidate all affected queries after mutations
4. **Use parallel fetching** - `Promise.all()` for independent queries

### Forms

1. **Validate on client and server** - Use Zod schemas on both sides
2. **Server Actions for mutations** - Prefer over API routes
3. **Show loading states** - Disable submit button while processing
4. **Handle errors gracefully** - Show clear error messages to users

### Styling

1. **Use shadcn/ui components** - Don't reinvent the wheel
2. **Tailwind utility classes** - Prefer over custom CSS
3. **Use `cn()` for conditional classes** - Merge classes properly
4. **Support dark mode** - Use CSS custom properties

---

**Next Steps:**
- See [System Design](system-design.md) for architecture overview
- See [Data Flow](data-flow.md) for data flow examples
- Check specific feature docs in `/docs/features/` for implementation details

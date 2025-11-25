# Data Flow Documentation

This document visualizes how data moves through the AI Finance Copilot application for common user actions.

## Overview

Data flows through 5 layers:
1. **UI** - User interaction
2. **Hooks** - React Query data fetching
3. **Server Actions** - Business logic and validation
4. **Prisma** - Database queries
5. **PostgreSQL** - Data storage

## Flow 1: Creating a Transaction

### User Journey
User fills out transaction form → Clicks "Create" → Transaction appears in list

### Detailed Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. User Interaction (Client Component)                      │
└──────────────────┬───────────────────────────────────────────┘
                   │
         User fills form in TransactionForm
         File: components/transactions/transaction-form.tsx
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. Form Submission (Client → Server)                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
         async function onSubmit(data) {
           await createTransaction(data)
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Server Action (Validation)                               │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: actions/transactions/create-transaction.ts

         'use server'
         export async function createTransaction(data) {
           // Validate with Zod
           const validated = transactionSchema.parse(data)
           ...
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Database Operation (Prisma)                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
         const transaction = await prisma.transaction.create({
           data: {
             amount: validated.amount,
             type: validated.type,
             accountId: validated.accountId,
             categoryId: validated.categoryId,
             date: validated.date,
             userId: userId,
           },
         })
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Side Effect: Balance Snapshot                            │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: actions/balance/record-balance-snapshot.ts

         await recordBalanceSnapshot(validated.accountId)
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. Database Insert (PostgreSQL)                             │
└──────────────────┬───────────────────────────────────────────┘
                   │
         INSERT INTO "Transaction" (...)
         INSERT INTO "AccountBalanceSnapshot" (...)
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. Cache Invalidation (React Query)                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
         queryClient.invalidateQueries(['accounts', userId])
         queryClient.invalidateQueries(['transactions', userId])
         queryClient.invalidateQueries(['dashboard', userId])
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. UI Re-render (Automatic)                                 │
└──────────────────────────────────────────────────────────────┘

         React Query refetches data
         Components re-render with new transaction
         User sees transaction in list
```

### File References

| Step | File Path |
|------|-----------|
| Form Component | `components/transactions/transaction-form.tsx` |
| Server Action | `actions/transactions/create-transaction.ts` |
| Validation | `lib/validations/transaction.ts` |
| Balance Snapshot | `actions/balance/record-balance-snapshot.ts` |
| Prisma Client | `lib/prisma.ts` |
| Database Schema | `prisma/schema.prisma` |

### Code Example

```typescript
// components/transactions/transaction-form.tsx
'use client'

import { createTransaction } from '@/actions/transactions/create-transaction'

export function TransactionForm() {
  async function onSubmit(data: FormData) {
    try {
      await createTransaction({
        amount: Number(data.get('amount')),
        type: data.get('type') as TransactionType,
        accountId: data.get('accountId') as string,
        categoryId: data.get('categoryId') as string,
        date: new Date(data.get('date') as string),
      })

      toast.success('Transaction created')
      router.push('/transactions')
    } catch (error) {
      toast.error('Failed to create transaction')
    }
  }

  return <form action={onSubmit}>...</form>
}
```

```typescript
// actions/transactions/create-transaction.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validations/transaction'
import { recordBalanceSnapshot } from '../balance/record-balance-snapshot'

export async function createTransaction(data: unknown) {
  // 1. Validate
  const validated = transactionSchema.parse(data)

  // 2. Create transaction
  const transaction = await prisma.transaction.create({
    data: validated,
  })

  // 3. Record balance snapshot
  await recordBalanceSnapshot(validated.accountId)

  // 4. Revalidate paths
  revalidatePath('/transactions')
  revalidatePath('/dashboard')

  return transaction
}
```

## Flow 2: Loading Dashboard Data

### User Journey
User navigates to /dashboard → Sees loading skeleton → Dashboard renders with data

### Detailed Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Navigation (User clicks "Dashboard")                     │
└──────────────────┬───────────────────────────────────────────┘
                   │
         Next.js router navigates to /dashboard
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. Page Component (Server Component)                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: app/(authenticated)/dashboard/page.tsx

         export default async function DashboardPage() {
           // Server component - can fetch directly
           const { data } = await queryClient.fetchQuery({
             queryKey: ['dashboard', userId],
             queryFn: () => getDashboardData(userId),
           })

           return <DashboardContent data={data} />
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Custom Hook (React Query)                                │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: hooks/use-dashboard.ts

         export function useDashboard(userId: string) {
           return useQuery({
             queryKey: ['dashboard', userId],
             queryFn: () => getDashboardData(userId),
             staleTime: 5 * 60 * 1000,  // 5 minutes
           })
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Server Action (Parallel Data Fetching)                   │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: actions/dashboard/get-dashboard-data.ts

         'use server'

         export async function getDashboardData(userId: string) {
           // Fetch all data in parallel
           const [expenses, creditCards, loans, recurring] =
             await Promise.all([
               prisma.transaction.findMany({
                 where: { userId, type: 'EXPENSE' },
                 orderBy: { date: 'desc' },
               }),
               prisma.account.findMany({
                 where: { userId, type: 'CREDIT_CARD' },
                 include: { balanceSnapshots: true },
               }),
               prisma.account.findMany({
                 where: { userId, type: 'LOAN' },
               }),
               prisma.recurringCharge.findMany({
                 where: { userId },
                 orderBy: { nextDueDate: 'asc' },
               }),
             ])

           return { expenses, creditCards, loans, recurring }
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Database Queries (PostgreSQL - Parallel)                 │
└──────────────────┬───────────────────────────────────────────┘
                   │
         SELECT * FROM "Transaction" WHERE "userId" = $1 AND "type" = 'EXPENSE'
         SELECT * FROM "Account" WHERE "userId" = $1 AND "type" = 'CREDIT_CARD'
         SELECT * FROM "Account" WHERE "userId" = $1 AND "type" = 'LOAN'
         SELECT * FROM "RecurringCharge" WHERE "userId" = $1

         (All queries run in parallel via Promise.all)
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. Data Transformation                                       │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: lib/expenseUtils.ts

         const totalExpenses = calculateMonthlyExpenses(expenses)
         const creditUtilization = calculateUtilization(creditCards)
         const upcomingPayments = getUpcomingPayments(recurring)
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. React Query Cache                                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
         Data stored in React Query cache
         Cache key: ['dashboard', userId]
         Stale time: 5 minutes
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. Component Rendering                                      │
└──────────────────────────────────────────────────────────────┘

         Dashboard components render with data:
         - ExpenseSummaryCard
         - CreditCardsList
         - LoanAccountsList
         - UpcomingPayments
```

### Performance Optimization

**Parallel Fetching:**
```typescript
// ✅ GOOD: Parallel fetching
const [expenses, accounts] = await Promise.all([
  prisma.transaction.findMany({ where: { userId } }),
  prisma.account.findMany({ where: { userId } }),
])
// Total time: ~100ms (whichever is slower)

// ❌ BAD: Sequential fetching
const expenses = await prisma.transaction.findMany({ where: { userId } })
const accounts = await prisma.account.findMany({ where: { userId } })
// Total time: ~200ms (sum of both)
```

## Flow 3: Account Balance History

### User Journey
User clicks on an account → Sees balance chart with time period selector

### Detailed Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. User clicks account in sidebar                           │
└──────────────────┬───────────────────────────────────────────┘
                   │
         Navigate to /accounts/[accountId]
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. Account Detail Page                                      │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: app/(authenticated)/accounts/[accountId]/page.tsx

         export default function AccountDetailPage({ params }) {
           const { data: account } = useAccount(params.accountId)

           return (
             <>
               <AccountHeader account={account} />
               <BalanceHistoryChart accountId={params.accountId} />
               <TransactionsList accountId={params.accountId} />
             </>
           )
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Balance History Component                                │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: components/accounts/balance-history-chart.tsx

         export function BalanceHistoryChart({ accountId }) {
           const [period, setPeriod] = useState('1M')

           const { data } = useQuery({
             queryKey: ['balance-history', accountId, period],
             queryFn: () => getBalanceHistory(accountId, period),
           })

           return <Chart data={data} />
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Balance History Server Action                            │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: actions/balance/get-balance-history.ts

         'use server'

         export async function getBalanceHistory(
           accountId: string,
           period: TimePeriod
         ) {
           const startDate = getStartDateForPeriod(period)

           const snapshots = await prisma.accountBalanceSnapshot.findMany({
             where: {
               accountId,
               date: { gte: startDate },
             },
             orderBy: { date: 'asc' },
           })

           return snapshots.map(s => ({
             date: s.date,
             balance: s.balance,
           }))
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Database Query                                           │
└──────────────────┬───────────────────────────────────────────┘
                   │
         SELECT * FROM "AccountBalanceSnapshot"
         WHERE "accountId" = $1 AND "date" >= $2
         ORDER BY "date" ASC

         (Uses composite index on accountId + date)
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. Chart Rendering                                          │
└──────────────────────────────────────────────────────────────┘

         Recharts library renders line chart
         User sees balance over time

         User can change period:
         1W, 1M, 3M, YTD, 1Y, ALL

         Each change triggers new query with different startDate
```

### Balance Snapshot Creation

**When snapshots are created:**

```
Transaction Created/Updated/Deleted
  ↓
recordBalanceSnapshot(accountId)
  ↓
Calculate current balance from all transactions
  ↓
Insert or update snapshot for today
  ↓
Snapshot available for charts
```

**Code:**
```typescript
// actions/balance/record-balance-snapshot.ts
'use server'

export async function recordBalanceSnapshot(accountId: string) {
  // 1. Calculate current balance
  const transactions = await prisma.transaction.findMany({
    where: { accountId },
  })

  const balance = transactions.reduce((sum, t) => {
    return t.type === 'INCOME' ? sum + t.amount : sum - t.amount
  }, 0)

  // 2. Upsert snapshot for today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.accountBalanceSnapshot.upsert({
    where: {
      accountId_date: {
        accountId,
        date: today,
      },
    },
    update: { balance },
    create: {
      accountId,
      date: today,
      balance,
    },
  })
}
```

## Flow 4: AI Chat Query

### User Journey
User opens AI chat → Asks "What were my expenses last month?" → Gets answer with data

### Detailed Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. User Input (Client Component)                            │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: components/ai-elements/ai-chat-panel.tsx

         User types: "What were my expenses last month?"
         Clicks send
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. API Request                                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
         POST /api/chat
         Body: { messages: [...] }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. API Route Handler                                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: app/api/chat/route.ts

         export async function POST(req: Request) {
           const { messages } = await req.json()

           // Call Anthropic API with tools
           const response = await anthropic.messages.create({
             model: 'claude-3-5-sonnet-20241022',
             messages,
             tools: [
               getRecentTransactions,
               analyzeSpending,
               // ... 5 more tools
             ],
           })

           // Handle tool calls if any
           if (response.stop_reason === 'tool_use') {
             const results = await executeTools(response.content)
             // Continue conversation with tool results
           }

           return new Response(stream)
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Tool Execution (analyzeSpending)                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
         Claude decides to use analyzeSpending tool

         function analyzeSpending(userId: string, period: string) {
           const startDate = getStartOfMonth(new Date())

           return prisma.transaction.findMany({
             where: {
               userId,
               type: 'EXPENSE',
               date: { gte: startDate },
             },
             include: { category: true },
           })
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Database Query                                           │
└──────────────────┬───────────────────────────────────────────┘
                   │
         SELECT t.*, c.* FROM "Transaction" t
         LEFT JOIN "Category" c ON t."categoryId" = c.id
         WHERE t."userId" = $1
           AND t."type" = 'EXPENSE'
           AND t."date" >= $2
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. Tool Result Processing                                   │
└──────────────────┬───────────────────────────────────────────┘
                   │
         Tool returns transaction data to Claude

         Claude analyzes data and generates response:
         "Last month you spent $2,450 across 45 transactions.
          Your top categories were:
          - Groceries: $650
          - Rent: $1,200
          - Utilities: $200
          ..."
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. Streaming Response                                       │
└──────────────────┬───────────────────────────────────────────┘
                   │
         Response streamed to client
         User sees answer appear word-by-word
```

### Available AI Tools

| Tool | Purpose | Data Source |
|------|---------|-------------|
| `getRecentTransactions` | Fetch recent transactions | `Transaction` model |
| `getAccountBalances` | Get all account balances | `Account` model |
| `analyzeSpending` | Analyze spending by category | `Transaction` + `Category` |
| `getBudgetStatus` | Get budget progress | `Budget` + `Transaction` |
| `getRecurringCharges` | List subscriptions | `RecurringCharge` model |
| `searchTransactions` | Search with filters | `Transaction` model |
| `getCategories` | List all categories | `Category` model |

## Flow 5: Global Search

### User Journey
User presses Cmd+K → Types "groceries" → Sees matching transactions and categories

### Detailed Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Keyboard Shortcut                                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
         User presses Cmd+K (Mac) or Ctrl+K (Windows)

         File: hooks/use-keyboard-shortcut.ts

         useEffect(() => {
           const handler = (e: KeyboardEvent) => {
             if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
               e.preventDefault()
               setSearchOpen(true)
             }
           }
           window.addEventListener('keydown', handler)
         }, [])
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. Search Command Palette Opens                             │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: components/search/search-command.tsx

         <CommandDialog open={searchOpen}>
           <CommandInput
             placeholder="Search transactions, accounts..."
             value={query}
             onValueChange={setQuery}
           />
           <CommandList>
             <SearchResults query={query} />
           </CommandList>
         </CommandDialog>
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Search Query (Debounced)                                 │
└──────────────────┬───────────────────────────────────────────┘
                   │
         User types "groceries"

         Debounced (300ms) to avoid excessive API calls

         File: hooks/use-search-results.ts

         const debouncedQuery = useDebounce(query, 300)

         const { data } = useQuery({
           queryKey: ['search', debouncedQuery],
           queryFn: () => searchAll(debouncedQuery),
           enabled: debouncedQuery.length > 0,
         })
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Search API Route                                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
         File: app/api/search/route.ts

         export async function GET(req: Request) {
           const { searchParams } = new URL(req.url)
           const query = searchParams.get('q')

           const [transactions, accounts, categories] =
             await Promise.all([
               prisma.transaction.findMany({
                 where: {
                   OR: [
                     { description: { contains: query, mode: 'insensitive' } },
                     { notes: { contains: query, mode: 'insensitive' } },
                   ],
                 },
                 take: 10,
               }),
               prisma.account.findMany({
                 where: { name: { contains: query, mode: 'insensitive' } },
                 take: 5,
               }),
               prisma.category.findMany({
                 where: { name: { contains: query, mode: 'insensitive' } },
                 take: 5,
               }),
             ])

           return Response.json({ transactions, accounts, categories })
         }
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Database Full-Text Search                                │
└──────────────────┬───────────────────────────────────────────┘
                   │
         SELECT * FROM "Transaction"
         WHERE "description" ILIKE '%groceries%'
            OR "notes" ILIKE '%groceries%'
         LIMIT 10

         (Case-insensitive search via ILIKE)
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. Results Rendering                                        │
└──────────────────────────────────────────────────────────────┘

         Results grouped by type:

         Transactions (5 results)
           - Whole Foods Market - $52.34
           - Trader Joe's - $38.21
           - ...

         Categories (1 result)
           - Groceries 🛒

         User can click to navigate to result
```

## Summary

### Key Patterns

1. **Server Actions** - All mutations go through server actions with validation
2. **React Query** - All data fetching cached and managed by React Query
3. **Parallel Fetching** - Use `Promise.all()` to fetch multiple queries simultaneously
4. **Cache Invalidation** - Invalidate relevant queries after mutations
5. **Type Safety** - TypeScript + Prisma + Zod for end-to-end type safety

### Performance Tips

1. **Parallel queries** - Always use `Promise.all()` for independent queries
2. **React Query caching** - Leverage stale/cache time to reduce API calls
3. **Database indexes** - Use composite indexes for common query patterns
4. **Debouncing** - Debounce search input to avoid excessive queries
5. **Optimistic updates** - Update UI immediately, revert on error

---

**Next:** Read [Patterns](patterns.md) to learn reusable component and code patterns.

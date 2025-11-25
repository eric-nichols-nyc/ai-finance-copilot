# System Architecture

## Overview

AI Finance Copilot is built on a **server-first, type-safe architecture** leveraging Next.js 16's App Router, React Server Components, and PostgreSQL for maximum performance and developer experience.

## Architecture Layers

### Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Presentation (React Components)                   │
│  • Server Components (default)                              │
│  • Client Components ('use client')                         │
│  • shadcn/ui + Tailwind CSS                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│  Layer 2: Data Fetching (React Query + Custom Hooks)        │
│  • React Query for caching                                  │
│  • Custom hooks (8 hooks)                                   │
│  • Query key management                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│  Layer 3: Business Logic (Server Actions)                   │
│  • 20+ server actions                                       │
│  • Zod validation                                           │
│  • Error handling                                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│  Layer 4: Data Access (Prisma ORM)                          │
│  • Type-safe database queries                               │
│  • 8 models with relationships                              │
│  • Transaction management                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│  Layer 5: Database (PostgreSQL)                             │
│  • Connection pooling                                       │
│  • Indexes for performance                                  │
│  • Referential integrity                                    │
└─────────────────────────────────────────────────────────────┘
```

## Layer 1: Presentation

### Server Components (Default)

**Philosophy:** Use Server Components by default for better performance.

**Benefits:**
- Zero JavaScript sent to client
- Direct database access
- Automatic code splitting
- Improved SEO

**Example:**
```typescript
// app/(authenticated)/dashboard/page.tsx
export default async function DashboardPage() {
  // Server component can directly fetch data
  const data = await getDashboardData()

  return <DashboardContent data={data} />
}
```

### Client Components

**When to use:**
- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Third-party libraries requiring client-side code

**Example:**
```typescript
'use client'  // Must be first line

import { useState } from 'react'

export function TransactionForm() {
  const [amount, setAmount] = useState('')
  // ... component logic
}
```

### UI Component System (shadcn/ui)

**Design System:**
- **80+ shadcn/ui components** - Pre-built, accessible components
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI primitives** - Unstyled, accessible components
- **CSS custom properties** - Theme tokens for light/dark mode

**Component Hierarchy:**
```
shadcn/ui (components/ui/)
  ├── Layout: Card, Separator, Sidebar
  ├── Forms: Button, Input, Select, Checkbox
  ├── Navigation: Tabs, Accordion, Dropdown
  ├── Feedback: Dialog, Alert, Toast, Tooltip
  └── Data: Table, Badge, Avatar, Charts
```

**Usage Pattern:**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function MetricCard({ title, value }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
```

## Layer 2: Data Fetching

### React Query (TanStack Query)

**Configuration:**
```typescript
// app/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      cacheTime: 10 * 60 * 1000,    // 10 minutes
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
})
```

**Why React Query?**
1. **Automatic caching** - Reduce unnecessary API calls
2. **Background refetching** - Keep data fresh
3. **Optimistic updates** - Instant UI feedback
4. **Devtools** - Debug data fetching
5. **Request deduplication** - Multiple components can request same data

### Custom Hooks Pattern

**File location:** `/hooks/`

**Example:** `hooks/use-accounts.ts`
```typescript
export function useAccounts(userId: string) {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => getAccounts(userId),
    enabled: !!userId,
  })
}
```

**Benefits:**
- Centralized data fetching logic
- Consistent query key management
- Easy to test and mock
- Reusable across components

**Available Hooks:**
1. `use-accounts.ts` - Account data fetching
2. `use-account-transactions.ts` - Transaction history
3. `use-dashboard.ts` - Dashboard aggregation
4. `use-recurrings.ts` - Recurring payments
5. `use-recurring-transactions.ts` - Transaction linking
6. `use-search-results.ts` - Global search
7. `use-keyboard-shortcut.ts` - Keyboard shortcuts
8. `use-mobile.ts` - Mobile detection

### Query Key Strategy

**Format:** `['resource', ...identifiers]`

**Examples:**
```typescript
['accounts', userId]                          // All accounts
['account', accountId]                        // Single account
['account-transactions', accountId, '2024']   // Account transactions
['dashboard', userId]                         // Dashboard data
['balance-history', accountId, period]        // Balance history
```

**Invalidation:**
```typescript
// After creating a transaction
queryClient.invalidateQueries(['accounts', userId])
queryClient.invalidateQueries(['dashboard', userId])
```

## Layer 3: Business Logic

### Server Actions

**File location:** `/actions/`

**Philosophy:** Use Server Actions instead of API routes for mutations.

**Benefits:**
- No API route needed
- Type-safe by default
- Automatic error handling
- Can be called from Server or Client Components
- Progressive enhancement support

**Structure:**
```
actions/
├── accounts/
│   ├── create-account.ts
│   ├── update-account.ts
│   ├── delete-account.ts
│   └── get-accounts.ts
├── transactions/
│   ├── create-transaction.ts
│   ├── update-transaction.ts
│   └── delete-transaction.ts
└── dashboard/
    └── get-dashboard-data.ts
```

**Example Server Action:**
```typescript
// actions/transactions/create-transaction.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validations/transaction'

export async function createTransaction(data: unknown) {
  // 1. Validate input
  const validated = transactionSchema.parse(data)

  // 2. Perform database operation
  const transaction = await prisma.transaction.create({
    data: validated,
  })

  // 3. Record balance snapshot (side effect)
  await recordBalanceSnapshot(transaction.accountId)

  // 4. Revalidate cache
  revalidatePath('/transactions')
  revalidatePath('/dashboard')

  return transaction
}
```

**Error Handling:**
```typescript
try {
  const result = await createTransaction(formData)
  toast.success('Transaction created')
} catch (error) {
  if (error instanceof ZodError) {
    toast.error('Invalid data')
  } else {
    toast.error('Something went wrong')
  }
}
```

### Validation with Zod

**File location:** `/lib/validations/`

**Example:**
```typescript
// lib/validations/transaction.ts
import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  categoryId: z.string().uuid(),
  accountId: z.string().uuid(),
  date: z.date(),
  notes: z.string().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
```

**Benefits:**
- Runtime validation
- Type inference
- Clear error messages
- Schema reuse (client + server)

## Layer 4: Data Access

### Prisma ORM

**File location:** `/lib/prisma.ts`

**Client Singleton Pattern:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@/app/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Why singleton?** Prevents connection pool exhaustion in development.

### Database Models

**8 Core Models:**

```prisma
// prisma/schema.prisma

model User {
  id               String    @id @default(uuid())
  email            String    @unique
  accounts         Account[]
  transactions     Transaction[]
  categories       Category[]
  budgets          Budget[]
  recurringCharges RecurringCharge[]
}

model Account {
  id               String    @id @default(uuid())
  name             String
  type             AccountType
  balance          Float     @default(0)
  userId           String
  user             User      @relation(fields: [userId], references: [id])
  transactions     Transaction[]
  balanceSnapshots AccountBalanceSnapshot[]

  // Credit card specific
  creditLimit      Float?

  // Loan specific
  originalBalance  Float?
  interestRate     Float?
  monthlyPayment   Float?
}

model Transaction {
  id          String    @id @default(uuid())
  amount      Float
  type        TransactionType
  date        DateTime
  description String?
  notes       String?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  accountId   String
  account     Account   @relation(fields: [accountId], references: [id])
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
}

model Category {
  id           String        @id @default(uuid())
  name         String
  color        String
  icon         String?
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
  budgets      Budget[]
}

model Budget {
  id         String   @id @default(uuid())
  amount     Float
  period     BudgetPeriod
  startDate  DateTime
  endDate    DateTime?
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  userId     String
  user       User     @relation(fields: [userId], references: [id])
}

model RecurringCharge {
  id          String    @id @default(uuid())
  name        String
  amount      Float
  frequency   Frequency
  nextDueDate DateTime
  accountId   String
  account     Account   @relation(fields: [accountId], references: [id])
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}

model AccountBalanceSnapshot {
  id         String   @id @default(uuid())
  accountId  String
  account    Account  @relation(fields: [accountId], references: [id])
  balance    Float
  date       DateTime @default(now())

  @@unique([accountId, date])
  @@index([accountId, date])
}
```

### Query Patterns

**Parallel Data Fetching:**
```typescript
// actions/dashboard/get-dashboard-data.ts
export async function getDashboardData(userId: string) {
  const [expenses, creditCards, loans, recurring] = await Promise.all([
    prisma.transaction.findMany({ where: { userId, type: 'EXPENSE' } }),
    prisma.account.findMany({ where: { userId, type: 'CREDIT_CARD' } }),
    prisma.account.findMany({ where: { userId, type: 'LOAN' } }),
    prisma.recurringCharge.findMany({ where: { userId } }),
  ])

  return { expenses, creditCards, loans, recurring }
}
```

**Including Related Data:**
```typescript
const transaction = await prisma.transaction.findUnique({
  where: { id },
  include: {
    category: true,
    account: true,
  },
})
```

**Aggregations:**
```typescript
const totalExpenses = await prisma.transaction.aggregate({
  where: { userId, type: 'EXPENSE' },
  _sum: { amount: true },
})
```

## Layer 5: Database

### PostgreSQL Configuration

**Connection Pooling:**
- Managed by Prisma
- Uses `@prisma/adapter-postgresql` for connection pooling
- Prevents connection exhaustion

**Indexes:**
```prisma
// Optimize common queries
@@index([userId, date])           // Transaction queries by user and date
@@index([accountId, date])        // Account balance history
@@unique([accountId, date])       // One snapshot per account per date
```

### Performance Optimizations

1. **Indexes on foreign keys** - Fast joins
2. **Composite indexes** - Multi-column queries
3. **Unique constraints** - Data integrity
4. **Cascade deletes** - Automatic cleanup
5. **Connection pooling** - Efficient connections

## Cross-Cutting Concerns

### Authentication (Supabase)

**Flow:**
```
User visits protected route
  ↓
Middleware checks session (middleware.ts)
  ↓
Session valid? → Continue
Session invalid? → Redirect to /sign-in
  ↓
After sign-in, sync user to Prisma (lib/user-sync.ts)
  ↓
User can access protected routes
```

**Files:**
- `middleware.ts` - Session verification
- `utils/supabase/middleware.ts` - Supabase middleware
- `lib/user-sync.ts` - Sync Supabase auth to Prisma User

### Error Handling

**Strategy:**
1. **Validation errors** - Caught by Zod, shown to user
2. **Database errors** - Logged, generic message to user
3. **Network errors** - React Query automatic retry
4. **Unexpected errors** - Error boundary catches, fallback UI

**Example:**
```typescript
try {
  await createTransaction(data)
} catch (error) {
  if (error instanceof ZodError) {
    return { error: 'Invalid input', details: error.errors }
  }
  console.error('Transaction creation failed:', error)
  return { error: 'Failed to create transaction' }
}
```

### Loading States

**Pattern:**
```typescript
const { data, isLoading, error } = useAccounts(userId)

if (isLoading) return <Skeleton />
if (error) return <ErrorMessage error={error} />

return <AccountsList accounts={data} />
```

## Key Design Decisions

### Why Server Components?

**Decision:** Use Server Components by default

**Rationale:**
- Better performance (less JavaScript to client)
- Direct database access
- Automatic code splitting
- Better SEO

**Trade-off:** Can't use React hooks or browser APIs (use Client Components when needed)

### Why Server Actions over API Routes?

**Decision:** Use Server Actions for mutations

**Rationale:**
- Type-safe by default
- No separate API route needed
- Simpler error handling
- Progressive enhancement support

**Trade-off:** Can't be called from external clients (not a concern for this app)

### Why React Query?

**Decision:** Use React Query for data fetching

**Rationale:**
- Automatic caching reduces API calls
- Background refetching keeps data fresh
- Optimistic updates improve UX
- Request deduplication

**Trade-off:** Additional library, learning curve (worth it for this use case)

### Why Prisma?

**Decision:** Use Prisma ORM

**Rationale:**
- Type-safe database queries
- Excellent TypeScript integration
- Migration system
- Prisma Studio for database visualization

**Trade-off:** Less control than raw SQL (rarely needed)

### Why PostgreSQL?

**Decision:** Use PostgreSQL over MongoDB/MySQL

**Rationale:**
- Strong ACID guarantees (important for finance data)
- Excellent support for complex queries
- JSON support when needed
- Robust ecosystem

**Trade-off:** Requires more setup than hosted solutions (acceptable)

## Scaling Considerations

### Current Architecture (Single Database)

**Good for:**
- Up to 10,000 users
- Up to 1M transactions
- Single-region deployment

**Limitations:**
- Single point of failure
- Limited horizontal scaling
- All data in one database

### Future Scaling Options

**Database:**
- **Read replicas** - Distribute read load
- **Sharding** - Partition by user ID
- **Caching layer** - Redis for hot data

**Application:**
- **Multiple instances** - Load balancer + multiple Next.js instances
- **CDN** - Cache static assets
- **Edge functions** - Deploy to edge locations

**When to scale:**
- Response times > 500ms
- Database CPU > 70%
- Memory usage > 80%
- User count > 10,000

---

## Summary

The architecture follows these principles:

1. **Server-first** - Server Components by default
2. **Type-safe** - TypeScript + Prisma + Zod
3. **Performance-focused** - React Query caching, parallel fetching
4. **Developer-friendly** - Clear patterns, good DX
5. **Production-ready** - Error handling, testing, monitoring

**Next:** Read [Data Flow](data-flow.md) to understand how data moves through the system.

# CLAUDE.md - AI Finance Copilot

This document provides comprehensive guidance for AI assistants working with the AI Finance Copilot codebase.

## Project Overview

**Project Name:** AI Finance Copilot (package name: `ai-finance-manager`)
**Status:** Production-Ready Application
**Purpose:** An AI-powered personal finance management application for tracking transactions, budgets, account balances, and gaining financial insights.

### Current State

This is a **fully functional, production-ready application** with:
- ✅ 8 major feature areas implemented (Dashboard, Accounts, Transactions, Budgets, Categories, Recurring Payments, AI Chat, Search)
- ✅ PostgreSQL database with Prisma ORM (8 models, 3 migrations)
- ✅ Supabase authentication with middleware
- ✅ AI integration with Claude 3.5 Sonnet (7 financial tools)
- ✅ Comprehensive testing infrastructure (Vitest + Playwright)
- ✅ 207+ TypeScript files
- ✅ Historical balance tracking system
- ✅ Global search with command palette
- ✅ Dark/light theme support

**This is NOT a template or scaffolded project** - it's a complete, working finance management system.

## Technology Stack

### Core Framework
- **Next.js 16.0.3** - App Router with Server Components
- **React 19.2.0** - Server Components + Client Components
- **TypeScript 5** - Strict mode enabled
- **Node.js** - Target ES2017

### Database & ORM
- **PostgreSQL** - Production database
- **Prisma ORM** - Type-safe database queries
- **Prisma Adapter** - Connection pooling
- **8 Models:** User, Account, Transaction, Category, Budget, RecurringCharge, InterestPayment, AccountBalanceSnapshot

### Authentication
- **Supabase** - Authentication provider
- **Middleware** - Session management and route protection
- **User Sync** - Automatic sync between Supabase auth and Prisma User model

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS with new @import syntax
- **shadcn/ui** - 80+ accessible, customizable components
- **Radix UI** - Unstyled component primitives
- **Geist Fonts** - Optimized typography
- **next-themes** - Dark/light mode support

### State Management
- **React Query (TanStack Query)** - Server state management
- **Custom Hooks** - 8 hooks for data fetching
- **React Context** - Search state management

### AI Integration
- **Anthropic Claude 3.5 Sonnet** - AI assistant
- **7 Financial Tools:** Transaction analysis, spending insights, budget tracking, etc.
- **Streaming Responses** - Real-time AI responses

### Testing
- **Vitest** - Unit and integration testing
- **Testing Library** - React component testing
- **Playwright** - E2E testing (Chromium, Firefox, WebKit)
- **4 E2E Test Suites** - Auth, home, error pages, examples

### Developer Tools
- **ESLint 9** - Flat config format
- **TypeScript Compiler** - Strict type checking
- **Prisma Studio** - Database GUI
- **React Query DevTools** - Query debugging

## Architecture Overview

### Layer Structure

```
┌────────────────────────────────────────┐
│  Presentation (Server + Client)       │
│  • Server Components (default)        │
│  • Client Components ('use client')   │
│  • shadcn/ui + Tailwind CSS          │
└──────────────┬─────────────────────────┘
               │
┌──────────────┴─────────────────────────┐
│  Data Fetching (React Query)          │
│  • Custom hooks (8 hooks)             │
│  • Query caching (5 min stale time)   │
└──────────────┬─────────────────────────┘
               │
┌──────────────┴─────────────────────────┐
│  Business Logic (Server Actions)      │
│  • 20+ server actions                 │
│  • Zod validation                     │
└──────────────┬─────────────────────────┘
               │
┌──────────────┴─────────────────────────┐
│  Data Access (Prisma)                 │
│  • 8 models with relationships        │
│  • Type-safe queries                  │
└──────────────┬─────────────────────────┘
               │
┌──────────────┴─────────────────────────┐
│  Database (PostgreSQL)                │
│  • Connection pooling                 │
│  • Indexes for performance            │
└────────────────────────────────────────┘
```

For detailed architecture, see [docs/architecture/system-design.md](docs/architecture/system-design.md).

## Directory Structure

```
ai-finance-copilot/
├── app/                           # Next.js App Router (77 files)
│   ├── (authenticated)/          # Protected routes with sidebar layout
│   │   ├── dashboard/           # Main dashboard
│   │   ├── accounts/            # Account management (split layout)
│   │   ├── transactions/        # Transaction listing
│   │   ├── budgets/             # Budget management
│   │   ├── categories/          # Category management
│   │   ├── recurrings/          # Recurring payments (split layout)
│   │   ├── cash-flow/           # Cash flow analysis
│   │   ├── investments/         # Investment tracking
│   │   ├── analytics/           # Financial analytics
│   │   ├── goals/               # Goal tracking
│   │   ├── settings/            # User settings
│   │   ├── explore/             # Explore features
│   │   └── help/                # Help section
│   ├── (unauthenticated)/       # Public routes
│   │   └── sign-in/             # Authentication page
│   ├── api/                      # API routes
│   │   ├── chat/                # AI chat endpoint (streaming)
│   │   └── search/              # Global search endpoint
│   ├── generated/prisma/         # Generated Prisma types
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── components/                    # React components (93 files)
│   ├── ui/                       # shadcn/ui components (80+)
│   ├── ai-elements/              # AI chat components (30+)
│   ├── app-sidebar.tsx           # Main sidebar navigation
│   ├── search/                   # Search command palette
│   └── [feature components]
│
├── actions/                       # Server actions (20 files)
│   ├── accounts/                 # Account CRUD operations
│   ├── transactions/             # Transaction CRUD operations
│   ├── balance/                  # Balance snapshot management
│   ├── dashboard/                # Dashboard data aggregation
│   ├── categories/               # Category operations
│   ├── recurrings/               # Recurring charge operations
│   └── auth/                     # Authentication actions
│
├── lib/                          # Utilities and helpers
│   ├── utils.ts                  # Core utilities (formatCurrency, formatDate, cn, etc.)
│   ├── expenseUtils.ts           # Expense calculations
│   ├── prisma.ts                 # Prisma client singleton
│   ├── user-sync.ts              # Supabase → Prisma user sync
│   ├── search-context.tsx        # Search context provider
│   └── validations/              # Zod validation schemas
│       ├── account.ts
│       └── transaction.ts
│
├── hooks/                        # Custom React hooks (8 files)
│   ├── use-accounts.ts           # Account data fetching
│   ├── use-account-transactions.ts
│   ├── use-dashboard.ts          # Dashboard data
│   ├── use-recurrings.ts         # Recurring payments
│   ├── use-recurring-transactions.ts
│   ├── use-search-results.ts     # Search functionality
│   ├── use-keyboard-shortcut.ts  # Keyboard shortcuts
│   └── use-mobile.ts             # Mobile detection
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema (8 models)
│   ├── migrations/               # Migration history (3 migrations)
│   └── seed.ts                   # Seed data script
│
├── utils/supabase/               # Supabase utilities
│   ├── server.ts                 # Server-side client
│   ├── client.ts                 # Client-side client
│   └── middleware.ts             # Session refresh
│
├── __tests__/                    # Unit/integration tests
│   ├── components/
│   └── lib/
│
├── e2e/                          # E2E tests (Playwright)
│   ├── auth-sign-in.spec.ts
│   ├── home.spec.ts
│   ├── error-pages.spec.ts
│   └── helpers/
│
├── docs/                         # Documentation
│   ├── index.md                  # Documentation hub
│   ├── getting-started/
│   │   ├── overview.md
│   │   └── quickstart.md
│   ├── architecture/
│   │   ├── system-design.md
│   │   ├── data-flow.md
│   │   └── patterns.md
│   ├── features/
│   │   ├── balance-tracking.md
│   │   ├── ai-chat.md
│   │   └── search.md
│   ├── api/
│   └── guides/
│       └── testing.md
│
├── middleware.ts                 # Next.js middleware (auth)
├── CLAUDE.md                     # This file
├── README.md                     # Project documentation
├── TESTING.md                    # Testing guide
└── [config files]
```

## Feature Areas

### 1. Dashboard (`app/(authenticated)/dashboard/`)

**Status:** ✅ Fully Implemented

**Features:**
- Total expenses summary card
- Credit card balances with utilization percentage
- Loan accounts with payment schedules
- Upcoming payments (next 2 weeks)
- Recurring subscriptions list

**Key Files:**
- `app/(authenticated)/dashboard/page.tsx`
- `actions/dashboard/get-dashboard-data.ts`
- `hooks/use-dashboard.ts`
- `lib/expenseUtils.ts`

**Data Flow:** Parallel data fetching with `Promise.all()` for expenses, credit cards, loans, and recurring charges.

### 2. Accounts (`app/(authenticated)/accounts/`)

**Status:** ✅ Fully Implemented

**Features:**
- Multiple account types (CREDIT_CARD, CHECKING, SAVINGS, LOAN, INVESTMENT)
- Create/Edit/Delete accounts
- Balance tracking with historical snapshots
- Transaction history grouped by month
- Interactive balance charts (1W, 1M, 3M, YTD, 1Y, ALL)
- Credit utilization calculation
- Split layout (accordion list + detail view)

**Key Files:**
- `app/(authenticated)/accounts/layout.tsx` (split layout)
- `app/(authenticated)/accounts/[accountId]/page.tsx`
- `actions/accounts/`
- `actions/balance/record-balance-snapshot.ts`

**Pattern:** Split layout with persistent left panel (accordion) and dynamic right panel (detail view).

See [docs/features/balance-tracking.md](docs/features/balance-tracking.md) for balance tracking system.

### 3. Transactions (`app/(authenticated)/transactions/`)

**Status:** ✅ Fully Implemented

**Features:**
- Full CRUD operations
- Transaction types: INCOME, EXPENSE, TRANSFER, INTEREST_CHARGE, LOAN_PAYMENT
- Category assignment with color coding
- Account association
- Date management
- Notes and descriptions
- Recurring transaction linking

**Key Files:**
- `app/(authenticated)/transactions/page.tsx`
- `actions/transactions/`
- `lib/validations/transaction.ts`

**Side Effects:** Creating/updating/deleting transactions triggers balance snapshot creation.

### 4. Recurring Payments (`app/(authenticated)/recurrings/`)

**Status:** ✅ Fully Implemented

**Features:**
- Subscription tracking
- Frequencies: WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
- Next due date calculation
- Split layout with charts
- Monthly grouping
- Transaction linking

**Key Files:**
- `app/(authenticated)/recurrings/layout.tsx` (split layout)
- `actions/recurrings/`

**Pattern:** Same split layout pattern as Accounts.

### 5. Categories & Budgets

**Status:** ✅ Fully Implemented

**Features:**
- Custom category creation with colors and icons
- Budget periods (MONTHLY, WEEKLY, YEARLY)
- Budget vs. actual tracking
- Start/end date management

**Key Files:**
- `app/(authenticated)/categories/`
- `app/(authenticated)/budgets/`

### 6. AI Chat Assistant (`app/api/chat/`)

**Status:** ✅ Fully Implemented

**Features:**
- Claude 3.5 Sonnet integration
- 7 financial tools for data analysis
- Streaming responses
- Context-aware financial advice
- Tool calling with automatic data fetching

**7 Financial Tools:**
1. `getRecentTransactions` - Fetch recent transactions with filters
2. `getAccountBalances` - Get all account balances
3. `analyzeSpending` - Analyze spending by category/time
4. `getBudgetStatus` - Get budget status and progress
5. `getRecurringCharges` - List subscriptions
6. `searchTransactions` - Search with filters
7. `getCategories` - Get all categories

**Key Files:**
- `app/api/chat/route.ts`
- `components/ai-elements/` (30+ components)

See [docs/features/ai-chat.md](docs/features/ai-chat.md) for details.

### 7. Global Search (Command Palette)

**Status:** ✅ Fully Implemented

**Features:**
- Keyboard shortcut (Cmd+K / Ctrl+K)
- Search across transactions, accounts, categories
- Debounced search (300ms)
- Context provider for state management
- Instant navigation to results

**Key Files:**
- `components/search/search-command.tsx`
- `hooks/use-search-results.ts`
- `lib/search-context.tsx`
- `app/api/search/route.ts`

See [docs/features/search.md](docs/features/search.md) for details.

### 8. Balance Tracking System

**Status:** ✅ Fully Implemented

**Features:**
- Automatic snapshots on transaction changes
- Historical balance data for charts
- Time-series analysis
- Multiple account aggregation
- One snapshot per account per date

**Key Files:**
- `actions/balance/record-balance-snapshot.ts`
- `actions/balance/get-balance-history.ts`
- `prisma/schema.prisma` (AccountBalanceSnapshot model)

**Trigger Points:**
- Transaction created
- Transaction updated
- Transaction deleted

See [docs/features/balance-tracking.md](docs/features/balance-tracking.md) for comprehensive documentation.

## Database Schema

### 8 Prisma Models

```prisma
User                      # User profiles (synced with Supabase)
Account                   # Financial accounts (credit card, bank, loan, investment)
Transaction               # Income/expense tracking
Category                  # User-defined categories with colors
Budget                    # Period-based budgets
RecurringCharge           # Subscription tracking
InterestPayment           # Credit card/loan interest
AccountBalanceSnapshot    # Historical balance tracking
```

### Key Relationships

```
User → Accounts (one-to-many)
User → Transactions (one-to-many)
User → Categories (one-to-many)
User → Budgets (one-to-many)
User → RecurringCharges (one-to-many)

Account → Transactions (one-to-many)
Account → BalanceSnapshots (one-to-many)
Account → RecurringCharges (one-to-many)

Transaction → Category (many-to-one)
Transaction → Account (many-to-one)
Transaction → RecurringCharge (many-to-one, optional)

Budget → Category (many-to-one)
```

### Database Indexes

- Composite index on `AccountBalanceSnapshot (accountId, date)`
- Unique constraint on `AccountBalanceSnapshot (accountId, date)` - one snapshot per day
- Foreign key indexes for all relationships

## Development Workflow

### Quick Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm start               # Start production server
npm run lint            # Run ESLint

# Database
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Create and apply migration
npx prisma migrate reset # Reset database (CAUTION!)
npx prisma studio       # Open Prisma Studio
npx prisma db seed      # Seed database with sample data
npx prisma db push      # Push schema without migration

# Testing
npm test                # Run unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Playwright UI mode
npm run test:all        # All tests
```

### Environment Variables

**Required in `.env`:**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_finance_copilot"

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Integration
ANTHROPIC_API_KEY="sk-ant-your-key"
```

## Key Conventions & Patterns

### File Naming

- **Components:** kebab-case (`transaction-card.tsx`, `account-list.tsx`)
- **Pages (App Router):** lowercase (`page.tsx`, `layout.tsx`)
- **Utilities:** camelCase (`formatCurrency.ts`, `dateHelpers.ts`)
- **Types:** PascalCase (`Transaction.ts`, `UserTypes.ts`)
- **Server Actions:** kebab-case with action prefix (`create-transaction.ts`, `get-accounts.ts`)

### Import Aliases

**Always use `@/` for imports from project root:**

```typescript
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createTransaction } from '@/actions/transactions/create-transaction'
import { useAccounts } from '@/hooks/use-accounts'
```

### Component Patterns

**Server Components (default):**
```typescript
// No 'use client' directive
export default async function DashboardPage() {
  // Can directly fetch data
  const data = await getDashboardData(userId)
  return <DashboardContent data={data} />
}
```

**Client Components (when needed):**
```typescript
'use client'  // Must be first line

import { useState } from 'react'

export function TransactionForm() {
  const [amount, setAmount] = useState(0)
  // Can use hooks, interactivity, browser APIs
}
```

**When to use Client Components:**
- Interactivity (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)
- Third-party libraries requiring client-side code

### Data Fetching Pattern

```typescript
// 1. Create custom hook with React Query
// hooks/use-accounts.ts
export function useAccounts(userId: string) {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => getAccounts(userId),
    staleTime: 5 * 60 * 1000,
  })
}

// 2. Create server action
// actions/accounts/get-accounts.ts
'use server'
export async function getAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    include: { balanceSnapshots: true },
  })
}

// 3. Use in component
function AccountsList() {
  const { data: accounts, isLoading } = useAccounts(userId)
  if (isLoading) return <Skeleton />
  return <div>{accounts.map(...)}</div>
}
```

### Server Action Pattern

```typescript
// actions/transactions/create-transaction.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validations/transaction'

export async function createTransaction(data: unknown) {
  // 1. Validate with Zod
  const validated = transactionSchema.parse(data)

  // 2. Database operation
  const transaction = await prisma.transaction.create({
    data: validated,
  })

  // 3. Side effects (balance snapshot)
  await recordBalanceSnapshot(validated.accountId)

  // 4. Revalidate cache
  revalidatePath('/transactions')
  revalidatePath('/dashboard')

  return transaction
}
```

### Form Validation Pattern

```typescript
// lib/validations/transaction.ts
import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  date: z.date(),
  notes: z.string().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
```

### React Query Invalidation Pattern

```typescript
// After mutation, invalidate related queries
queryClient.invalidateQueries(['accounts', userId])
queryClient.invalidateQueries(['transactions', userId])
queryClient.invalidateQueries(['dashboard', userId])
```

### Split Layout Pattern

**Used for:** Accounts, Recurring Payments

```typescript
// layout.tsx
export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <LeftPanel>
        <Accordion>...</Accordion>
      </LeftPanel>
      <RightPanel>{children}</RightPanel>
    </div>
  )
}
```

See [docs/architecture/patterns.md](docs/architecture/patterns.md) for comprehensive pattern catalog.

## AI Assistant Guidelines

### When Working with This Codebase

1. **Understand the Current State**
   - This is a PRODUCTION application with 8 implemented feature areas
   - All major features are functional
   - Focus on bug fixes, enhancements, and optimizations

2. **Before Making Changes**
   - Read relevant feature documentation in `docs/features/`
   - Understand data flow in [docs/architecture/data-flow.md](docs/architecture/data-flow.md)
   - Check existing patterns in [docs/architecture/patterns.md](docs/architecture/patterns.md)
   - Run tests before and after changes

3. **Follow Next.js 16 Best Practices**
   - Use Server Components by default
   - Only add `'use client'` when needed
   - Leverage Server Actions for mutations
   - Use App Router patterns (not Pages Router)

4. **Maintain Type Safety**
   - Always use TypeScript
   - Validate with Zod schemas
   - Use Prisma-generated types
   - Avoid `any` type

5. **Code Quality**
   - Run `npm run lint` before committing
   - Ensure tests pass (`npm test`)
   - Follow existing patterns
   - Keep solutions simple (avoid over-engineering)

6. **Styling**
   - Always use shadcn/ui components as foundation
   - Use Tailwind CSS utility classes
   - Support both light and dark modes
   - Use `cn()` utility for conditional classes

### Common Tasks

#### Adding a New Feature

1. Create necessary database models in `prisma/schema.prisma`
2. Run `npx prisma migrate dev` to create migration
3. Create server actions in `actions/[feature]/`
4. Create custom hooks in `hooks/use-[feature].ts`
5. Create components in `app/(authenticated)/[feature]/`
6. Add navigation link in sidebar
7. Write tests
8. Update documentation in `docs/features/`

#### Modifying a Server Action

1. Update action in `actions/[feature]/[action].ts`
2. Update validation schema if needed (`lib/validations/`)
3. Update affected components
4. Invalidate relevant React Query caches
5. Run tests
6. Update `docs/api/server-actions.md` if needed

#### Adding a New Component

1. Check if shadcn/ui has a suitable component first
2. Create component in appropriate directory
3. Use TypeScript for props
4. Follow naming conventions (kebab-case)
5. Use `cn()` for conditional classes
6. Support dark mode
7. Add to `docs/architecture/patterns.md` if reusable

#### Debugging Data Flow

1. Check [docs/architecture/data-flow.md](docs/architecture/data-flow.md) for similar flows
2. Use React Query DevTools to inspect queries
3. Check Prisma Studio for database state
4. Add console.logs in server actions
5. Check Network tab for API calls

### Important Notes

1. **Database Changes Require Migrations**
   - Never edit the database directly in production
   - Always use `npx prisma migrate dev` in development
   - Test migrations in staging before production

2. **Balance Snapshots Are Automatic**
   - Creating/updating/deleting transactions triggers snapshot creation
   - Don't manually create snapshots unless necessary
   - See [docs/features/balance-tracking.md](docs/features/balance-tracking.md)

3. **Authentication Is Supabase-Based**
   - User must be signed in to access protected routes
   - Middleware handles session verification
   - User sync happens automatically

4. **React Query Caching**
   - Stale time: 5 minutes
   - Cache time: 10 minutes
   - Always invalidate affected queries after mutations

5. **Server Actions vs API Routes**
   - Prefer Server Actions for mutations
   - Use API routes only for external access or special cases (AI chat, search)

## Documentation

### Main Documentation Files

- **[docs/index.md](docs/index.md)** - Documentation hub and navigation
- **[docs/getting-started/overview.md](docs/getting-started/overview.md)** - Project overview
- **[docs/getting-started/quickstart.md](docs/getting-started/quickstart.md)** - Setup guide
- **[docs/architecture/system-design.md](docs/architecture/system-design.md)** - System architecture
- **[docs/architecture/data-flow.md](docs/architecture/data-flow.md)** - Data flow examples
- **[docs/architecture/patterns.md](docs/architecture/patterns.md)** - Reusable patterns
- **[docs/features/balance-tracking.md](docs/features/balance-tracking.md)** - Balance tracking system
- **[docs/features/ai-chat.md](docs/features/ai-chat.md)** - AI chat integration
- **[docs/features/search.md](docs/features/search.md)** - Global search
- **[TESTING.md](TESTING.md)** - Testing guide

### When to Update Documentation

- **Architecture changes** → Update `docs/architecture/`
- **New features** → Add to `docs/features/`
- **New patterns** → Add to `docs/architecture/patterns.md`
- **API changes** → Update `docs/api/`
- **Major changes** → Update this CLAUDE.md

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)

## Quick Reference

### File Locations Cheat Sheet

| Type | Location |
|------|----------|
| **Pages** | `app/(authenticated)/[feature]/page.tsx` |
| **Layouts** | `app/(authenticated)/[feature]/layout.tsx` |
| **Server Actions** | `actions/[feature]/[action].ts` |
| **Hooks** | `hooks/use-[feature].ts` |
| **Components** | `components/` or `app/(authenticated)/[feature]/` |
| **UI Components** | `components/ui/` (shadcn) |
| **Utilities** | `lib/utils.ts` or `lib/[specific].ts` |
| **Validations** | `lib/validations/[model].ts` |
| **Database Schema** | `prisma/schema.prisma` |
| **Migrations** | `prisma/migrations/` |
| **Tests** | `__tests__/` (unit) or `e2e/` (E2E) |
| **Documentation** | `docs/` |

### Common Utilities

```typescript
// From lib/utils.ts
formatCurrency(amount)              // $1,234.56
formatDate(date)                    // November 25, 2025
formatDateShort(date)               // Nov 25
getStartOfMonth(date)               // First day of month
getEndOfMonth(date)                 // Last day of month
getDaysUntil(date)                  // Days until date
calculateUtilization(used, limit)   // Credit utilization %
getUtilizationColor(utilization)    // Color based on utilization
cn(...classes)                      // Merge CSS classes
```

---

**Last Updated:** 2025-11-25
**Document Version:** 2.0 (Complete Rewrite)
**Project Status:** Production-Ready

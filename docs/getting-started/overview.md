# Project Overview

## What is AI Finance Copilot?

AI Finance Copilot is a **production-ready, AI-powered personal finance management application** built with modern web technologies. It helps users track transactions, manage budgets, monitor account balances, and gain financial insights through an integrated AI assistant.

## Current Status

**Status:** Production-ready application
**Complexity:** 207+ TypeScript files
**Lines of Code:** ~15,000+ (excluding dependencies)
**Test Coverage:** Unit tests + E2E tests configured

This is **NOT** a starter template or scaffolded project. It's a fully functional finance management system with:
- 8 major feature areas implemented
- Complete authentication system
- AI integration with Claude 3.5 Sonnet
- Comprehensive balance tracking
- Historical data and analytics

## Tech Stack

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (80+ components)
- **State Management:** React Query (TanStack Query)

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Supabase Authentication
- **API:** Next.js Server Actions + API Routes
- **AI:** Anthropic Claude 3.5 Sonnet API

### Developer Tools
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Linting:** ESLint 9 (flat config)
- **Type Checking:** TypeScript strict mode
- **Package Manager:** npm

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface (React)                  │
│              Server Components + Client Components           │
│                    shadcn/ui + Tailwind CSS                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                  Data Fetching Layer                         │
│         React Query + Custom Hooks (8 hooks)                 │
│    use-accounts, use-dashboard, use-transactions, etc.       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│              Business Logic Layer                            │
│           Server Actions (20+ actions)                       │
│   create-transaction, get-dashboard-data, etc.               │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                Data Access Layer                             │
│                   Prisma ORM                                 │
│      User, Account, Transaction, Category, etc.              │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                  Database Layer                              │
│                   PostgreSQL                                 │
│         Connection pooling via Prisma Adapter                │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Server-First Architecture** - Use Server Components by default, Client Components only when needed
2. **Type Safety** - End-to-end TypeScript with strict mode
3. **Performance** - React Query caching, parallel data fetching, optimistic updates
4. **Accessibility** - shadcn/ui components built on Radix UI primitives
5. **Developer Experience** - Hot reload, clear error messages, comprehensive testing

## Feature Overview

### 1. Dashboard
**Status:** ✅ Fully Implemented
**Location:** `app/(authenticated)/dashboard/`

- Summary cards (expenses, credit utilization, loans, recurring payments)
- Credit card overview with utilization
- Loan accounts with payment schedules
- Upcoming payments (next 2 weeks)
- Recurring subscriptions list

### 2. Accounts Management
**Status:** ✅ Fully Implemented
**Location:** `app/(authenticated)/accounts/`

- Multiple account types (credit cards, bank accounts, loans, investments)
- Balance tracking with historical snapshots
- Transaction history grouped by month
- Interactive balance charts (1W, 1M, 3M, YTD, 1Y, ALL)
- Split layout (list + detail view)

### 3. Transactions
**Status:** ✅ Fully Implemented
**Location:** `app/(authenticated)/transactions/`

- Full CRUD operations
- Transaction types: INCOME, EXPENSE, TRANSFER, INTEREST_CHARGE, LOAN_PAYMENT
- Category assignment with color coding
- Account association
- Recurring transaction linking

### 4. Balance Tracking
**Status:** ✅ Fully Implemented
**Location:** System-wide feature

- Automatic balance snapshots on transaction changes
- Historical balance data for charts
- Time-series analysis
- Multiple account aggregation
- See [Balance Tracking](../features/balance-tracking.md) for details

### 5. Recurring Payments
**Status:** ✅ Fully Implemented
**Location:** `app/(authenticated)/recurrings/`

- Subscription tracking
- Multiple frequencies (weekly, monthly, quarterly, yearly)
- Next due date calculation
- Split layout with charts
- Monthly grouping

### 6. Categories & Budgets
**Status:** ✅ Fully Implemented
**Location:** `app/(authenticated)/categories/`, `app/(authenticated)/budgets/`

- Custom category creation
- Color and icon assignment
- Budget periods (monthly, weekly, yearly)
- Budget vs. actual tracking

### 7. AI Chat Assistant
**Status:** ✅ Fully Implemented
**Location:** `app/api/chat/`, AI panel component

- Claude 3.5 Sonnet integration
- 7 financial tools (transactions, spending analysis, budgets, etc.)
- Streaming responses
- Context-aware financial advice
- See [AI Chat](../features/ai-chat.md) for details

### 8. Global Search
**Status:** ✅ Fully Implemented
**Location:** Command palette (Cmd+K)

- Search across transactions, accounts, categories
- Keyboard shortcuts
- Context provider for search state
- See [Search](../features/search.md) for details

## Database Schema

### Models (8 models)

1. **User** - User profiles linked to Supabase auth
2. **Account** - Financial accounts (bank, credit card, loan, investment)
3. **Transaction** - Income and expense tracking
4. **Category** - User-defined transaction categories
5. **Budget** - Period-based budgets
6. **RecurringCharge** - Subscription and recurring payment tracking
7. **InterestPayment** - Credit card/loan interest tracking
8. **AccountBalanceSnapshot** - Historical balance tracking

### Key Relationships

```
User
 ├── Accounts (one-to-many)
 ├── Transactions (one-to-many)
 ├── Categories (one-to-many)
 ├── Budgets (one-to-many)
 └── RecurringCharges (one-to-many)

Account
 ├── Transactions (one-to-many)
 ├── RecurringCharges (one-to-many)
 └── BalanceSnapshots (one-to-many)

Transaction
 ├── Category (many-to-one)
 ├── Account (many-to-one)
 └── RecurringCharge (many-to-one, optional)

Budget
 └── Category (many-to-one)
```

## Directory Structure

```
ai-finance-copilot/
├── app/                           # Next.js App Router (77 files)
│   ├── (authenticated)/          # Protected routes
│   │   ├── dashboard/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── categories/
│   │   ├── recurrings/
│   │   └── [other features]/
│   ├── (unauthenticated)/        # Public routes
│   │   └── sign-in/
│   ├── api/                      # API routes
│   │   ├── chat/                 # AI chat endpoint
│   │   └── search/               # Search endpoint
│   └── generated/prisma/         # Generated Prisma types
│
├── components/                    # React components (93 files)
│   ├── ui/                       # shadcn/ui components (80+)
│   ├── ai-elements/              # AI chat components (30+)
│   └── [shared components]
│
├── actions/                       # Server actions (20 files)
│   ├── accounts/
│   ├── transactions/
│   ├── dashboard/
│   └── [other actions]
│
├── lib/                          # Utilities and helpers
│   ├── utils.ts                  # Core utilities
│   ├── expenseUtils.ts           # Expense calculations
│   ├── prisma.ts                 # Prisma client
│   └── validations/              # Zod schemas
│
├── hooks/                        # Custom React hooks (8 files)
│   ├── use-accounts.ts
│   ├── use-dashboard.ts
│   └── [other hooks]
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration history
│   └── seed.ts                   # Seed data
│
├── __tests__/                    # Unit tests
├── e2e/                          # E2E tests
└── docs/                         # Documentation (you are here!)
```

## Development Workflow

### Quick Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)

# Database
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open Prisma Studio
npx prisma db seed      # Seed database

# Testing
npm test                # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:all        # Run all tests

# Code Quality
npm run lint            # Run ESLint
npm run build           # Production build
```

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# AI Integration
ANTHROPIC_API_KEY="sk-ant-..."
```

## Key Conventions

### File Naming
- **Components:** kebab-case (`transaction-card.tsx`)
- **Pages:** lowercase (`page.tsx`, `layout.tsx`)
- **Utilities:** camelCase (`formatCurrency.ts`)
- **Types:** PascalCase (`Transaction.ts`)

### Import Aliases
Use `@/` for all imports from project root:

```typescript
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getAccounts } from '@/actions/accounts/get-accounts'
```

### Component Patterns
- **Server Components by default** (no 'use client')
- **Add 'use client' only when needed** (hooks, interactivity, browser APIs)
- **Use shadcn/ui components** for all UI elements
- **Tailwind CSS for styling** (no CSS modules)

## What Makes This Project Unique

1. **AI-Powered Financial Insights** - Integrated Claude 3.5 Sonnet with 7 custom tools
2. **Historical Balance Tracking** - Automatic snapshots for time-series analysis
3. **Split Layout Pattern** - Innovative UI for accounts and recurring payments
4. **Server-First Architecture** - Leverages Next.js 16 Server Components
5. **Type-Safe Throughout** - End-to-end TypeScript with Prisma
6. **Production-Ready Testing** - Unit + E2E test coverage

## Next Steps

- **New to the project?** → Read [Quickstart](quickstart.md)
- **Want to understand architecture?** → See [System Design](../architecture/system-design.md)
- **Looking to add a feature?** → Check [Patterns](../architecture/patterns.md)
- **Need to debug?** → See [Data Flow](../architecture/data-flow.md)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-25
**Project Version:** Production-ready

# CLAUDE.md - AI Finance Copilot

This document provides comprehensive guidance for AI assistants working with the AI Finance Copilot codebase.

## Project Overview

**Project Name:** AI Finance Copilot (package name: `ai-finance-manager`)
**Status:** Early Development / Scaffolding Phase
**Purpose:** An AI-powered finance management application for tracking transactions, budgets, and financial insights.

### Current State

This is a **freshly initialized Next.js 16 project** with modern web technologies. The repository is in the planning/setup stage with:
- Modern, well-configured tech stack
- Good foundation for a finance application
- README outlining planned Prisma/PostgreSQL integration
- **No actual application features implemented yet** (still contains Next.js template code)

## Technology Stack

### Core Framework
- **Next.js 16.0.3** - Latest version with App Router
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5** - Strict mode enabled
- **Node.js** - Target ES2017

### Styling
- **Tailwind CSS v4** - Latest major version with new @import syntax
- **PostCSS** - With @tailwindcss/postcss plugin
- **CSS Custom Properties** - For theming (light/dark mode)
- **Geist & Geist Mono fonts** - Optimized via next/font/google

### Development Tools
- **ESLint 9** - With Next.js config presets and flat config format
- **TypeScript Compiler** - Strict type checking enabled

### Planned (Not Yet Implemented)
- **Prisma ORM** - For database management (mentioned in README)
- **PostgreSQL** - Database (mentioned in README)
- **Authentication** - Not yet configured
- **Testing Framework** - Not yet configured

## Directory Structure

```
ai-finance-copilot/
├── app/                     # Next.js App Router directory
│   ├── favicon.ico         # Website favicon
│   ├── globals.css         # Global styles with Tailwind v4
│   ├── layout.tsx          # Root layout with fonts and metadata
│   └── page.tsx            # Home page (currently template code)
│
├── public/                  # Static assets served directly
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .gitignore              # Ignores node_modules, .next, .env, etc.
├── README.md               # Project documentation
├── eslint.config.mjs       # ESLint configuration (flat config)
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── postcss.config.mjs      # PostCSS configuration for Tailwind
└── tsconfig.json           # TypeScript configuration
```

### Directories to Create (Not Yet Present)

Based on typical Next.js patterns and the README, these directories will likely be needed:

- `app/api/` - API routes for backend logic
- `components/` - Reusable React components
- `lib/` - Utility functions and shared logic (e.g., `lib/prisma.ts`)
- `types/` - TypeScript type definitions
- `prisma/` - Prisma schema and migrations
- `hooks/` - Custom React hooks
- `services/` - Business logic and external API integrations

## Development Workflow

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Access at http://localhost:3000

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Run production build:**
   ```bash
   npm start
   ```

5. **Lint code:**
   ```bash
   npm run lint
   ```

### Planned Database Workflow (Not Yet Functional)

The README mentions these Prisma commands (not yet in package.json):
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Create and apply migrations
- `pnpm prisma:push` - Push schema changes without migrations
- `pnpm prisma:studio` - Open Prisma Studio UI
- `pnpm prisma:seed` - Seed the database

**Note:** These scripts need to be added to package.json before use.

## Configuration Files

### TypeScript Configuration

**File:** `tsconfig.json`

Key settings:
- **Target:** ES2017
- **Strict mode:** Enabled (strict type checking)
- **Module resolution:** Bundler
- **Path alias:** `@/*` maps to `./*` for cleaner imports
- **JSX:** react-jsx (no need to import React)

**Usage:**
```typescript
// Use the @ alias for imports
import { Component } from '@/components/Component'
import { prisma } from '@/lib/prisma'
```

### ESLint Configuration

**File:** `eslint.config.mjs`

- Uses new **flat config format** (ESLint 9)
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `dist/`

**Running linter:**
```bash
npm run lint
```

### Next.js Configuration

**File:** `next.config.ts`

Currently minimal/default configuration. This is where you would add:
- Environment variables
- Image domains
- Redirects/rewrites
- Build configuration
- Experimental features

### Tailwind CSS v4

**File:** `app/globals.css`

Uses the new Tailwind CSS v4 syntax:
```css
@import "tailwindcss";  /* New v4 syntax */

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Important:** Tailwind v4 uses `@import` instead of `@tailwind` directives.

## Key Conventions & Patterns

### File Naming

- **Components:** PascalCase (e.g., `UserProfile.tsx`, `TransactionList.tsx`)
- **Pages (App Router):** lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.ts`, `dateHelpers.ts`)
- **Types:** PascalCase (e.g., `Transaction.ts`, `UserTypes.ts`)

### Component Patterns

**Server Components (Default):**
```typescript
// app/transactions/page.tsx
export default async function TransactionsPage() {
  // Can directly fetch data
  const transactions = await fetchTransactions()
  return <div>{/* render */}</div>
}
```

**Client Components:**
```typescript
'use client'  // Must be first line

import { useState } from 'react'

export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <div>{/* render */}</div>
}
```

### Import Order Convention

Follow this order for cleaner imports:
1. React/Next.js imports
2. Third-party libraries
3. Local components (using `@/` alias)
4. Types
5. Styles

Example:
```typescript
import { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { Transaction } from '@/types/Transaction'
import './styles.css'
```

### TypeScript Best Practices

- **Always use TypeScript** - No `.js` or `.jsx` files
- **Explicit types** for function parameters and return values
- **Interfaces over types** for object shapes (unless you need unions)
- **Avoid `any`** - Use `unknown` if type is truly unknown
- **Use type inference** where obvious (e.g., `const count = 0` vs `const count: number = 0`)

Example:
```typescript
// Good
interface Transaction {
  id: string
  amount: number
  category: string
}

async function getTransactions(userId: string): Promise<Transaction[]> {
  // implementation
}

// Avoid
function getTransactions(userId: any): any {
  // implementation
}
```

### React 19 Features to Leverage

- **Server Components** by default - Use for data fetching
- **Server Actions** - For form submissions and mutations
- **Streaming** - For progressive UI loading
- **Suspense** - For loading states

## Planned Database Schema

According to README, these models are planned:

- **User** - User accounts
- **Account** - Financial accounts (bank, credit card, etc.)
- **Transaction** - Income and expense transactions
- **Category** - Transaction categories
- **Budget** - Budget tracking

**Location (planned):** `lib/prisma.ts` for client singleton

**Usage pattern (planned):**
```typescript
import { prisma } from '@/lib/prisma'

const transactions = await prisma.transaction.findMany({
  where: { userId: 'user-id' },
  include: { category: true, account: true }
})
```

## AI Assistant Guidelines

### When Working with This Codebase

1. **Understand the Current State**
   - This is a fresh Next.js project with NO actual features implemented yet
   - The home page (app/page.tsx) still contains Next.js template code
   - Database/Prisma is planned but NOT configured yet

2. **Before Adding New Features**
   - Check if the feature requires Prisma (database) - if so, Prisma needs to be set up first
   - Consider if new directories are needed (components/, lib/, etc.)
   - Ensure TypeScript types are properly defined

3. **Follow Next.js 16 Best Practices**
   - Use Server Components by default
   - Only add `'use client'` when needed (interactivity, hooks, browser APIs)
   - Leverage Server Actions for mutations instead of API routes when possible
   - Use the App Router patterns (not Pages Router)

4. **Maintain Code Quality**
   - Run `npm run lint` before committing
   - Ensure TypeScript has no errors
   - Follow existing patterns for consistency
   - Add proper error handling

5. **Path Aliases**
   - Always use `@/` for imports from root directory
   - Example: `import { Component } from '@/components/Component'`

6. **Styling Approach**
   - Use Tailwind CSS utility classes
   - Follow the existing color scheme (CSS custom properties in globals.css)
   - Support both light and dark modes
   - Use the Geist fonts (already configured)

7. **File Location Recommendations**
   - **Components:** Create `components/` directory, organize by feature if complex
   - **Utilities:** Create `lib/` directory for shared functions
   - **Types:** Create `types/` directory for shared TypeScript types
   - **API Routes:** Use `app/api/` directory
   - **Database:** `lib/prisma.ts` for Prisma client (when implemented)

### Common Tasks

#### Creating a New Page

```typescript
// app/dashboard/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | AI Finance Copilot',
  description: 'View your financial dashboard',
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
```

#### Creating a New Component

```typescript
// components/TransactionCard.tsx
interface TransactionCardProps {
  amount: number
  category: string
  date: Date
}

export function TransactionCard({ amount, category, date }: TransactionCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-lg font-semibold">${amount}</p>
      <p className="text-sm text-zinc-600">{category}</p>
    </div>
  )
}
```

#### Adding an API Route

```typescript
// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ transactions: [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Handle POST request
  return NextResponse.json({ success: true })
}
```

### Important Notes

1. **Project Name Discrepancy**
   - Repository: `ai-finance-copilot`
   - Package.json: `ai-finance-manager`
   - Consider aligning these names

2. **Metadata Still Generic**
   - Layout metadata still says "Create Next App" (app/layout.tsx:16-18)
   - Should be updated to reflect actual project

3. **Missing Prisma Scripts**
   - README mentions Prisma commands
   - These scripts are NOT in package.json yet
   - Prisma is NOT installed in dependencies yet

4. **No Environment Variables Setup**
   - No `.env.example` file
   - No environment variable documentation
   - Should be added when Prisma is configured

5. **No Testing Framework**
   - No Jest, Vitest, or other test framework configured
   - No test files present
   - Should be added for production readiness

## Next Steps for Development

Based on the current state, here are recommended next steps:

1. **Update Project Metadata**
   - Change app/layout.tsx metadata to reflect actual project
   - Align package name with repository name

2. **Set Up Prisma (if database is needed)**
   - Install Prisma: `npm install prisma @prisma/client`
   - Initialize: `npx prisma init`
   - Define schema in `prisma/schema.prisma`
   - Add Prisma scripts to package.json
   - Create `lib/prisma.ts` for client singleton

3. **Create Directory Structure**
   - `components/` for React components
   - `lib/` for utilities and shared logic
   - `types/` for TypeScript type definitions
   - `app/api/` for API routes

4. **Implement Core Features**
   - Replace template home page with actual landing page
   - Build out planned features (transactions, budgets, etc.)

5. **Add Testing**
   - Configure Jest or Vitest
   - Set up React Testing Library
   - Add E2E tests (Playwright/Cypress)

6. **Environment Configuration**
   - Create `.env.example` file
   - Document required environment variables
   - Set up different configs for dev/staging/production

7. **CI/CD**
   - Add GitHub Actions for tests and linting
   - Configure automatic deployments (Vercel recommended)

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Deployment

**Recommended Platform:** Vercel (optimized for Next.js)

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

**Alternative Platforms:**
- Netlify
- AWS Amplify
- Docker containers (self-hosted)

## Contact & Support

For questions about this codebase or development guidelines, refer to:
- README.md for project overview
- This CLAUDE.md for AI assistant guidelines
- Next.js documentation for framework-specific questions

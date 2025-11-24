# 💰 AI Finance Copilot

An intelligent finance management application powered by AI to help you track transactions, manage budgets, and gain insights into your financial health.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Database Setup](#database-setup)
- [UI Components](#ui-components)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AI Finance Copilot is a modern web application designed to help individuals and families manage their finances effectively. Built with the latest web technologies, it provides an intuitive interface for tracking income and expenses, categorizing transactions, setting budgets, and receiving AI-powered financial insights.

**Current Status:** Early Development / Scaffolding Phase

## ✨ Features

### Current Features
- ✅ Modern, responsive UI with light/dark mode support
- ✅ Type-safe development with TypeScript
- ✅ Component library with shadcn/ui
- ✅ Optimized fonts (Geist Sans & Geist Mono)

### Planned Features
- 🔄 User authentication and authorization
- 🔄 Financial account management (bank accounts, credit cards, investments)
- 🔄 Transaction tracking and categorization
- 🔄 Budget creation and monitoring
- 🔄 AI-powered financial insights and recommendations
- 🔄 Spending analytics and visualizations
- 🔄 Recurring transaction management
- 🔄 Export and reporting capabilities
- 🔄 Multi-currency support

## 🛠 Tech Stack

### Core Framework
- **[Next.js 16.0.3](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://reactjs.org/)** - UI library with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Static type checking

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component library
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Geist Font](https://vercel.com/font)** - Optimized font family

### Database & ORM (Planned)
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database

### Development Tools
- **[ESLint 9](https://eslint.org/)** - Code linting with flat config
- **[next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)** - Automatic font optimization

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **pnpm** / **yarn** / **bun**)
- **Git** for version control
- **PostgreSQL** (when database setup is needed)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/eric-nichols-nyc/ai-finance-copilot.git
cd ai-finance-copilot
```

### 2. Install Dependencies

```bash
npm install
```

Or using your preferred package manager:

```bash
# Using pnpm
pnpm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will auto-reload when you make changes to the code.

## 📁 Project Structure

```
ai-finance-copilot/
├── app/                     # Next.js App Router directory
│   ├── api/                # API routes (to be created)
│   ├── favicon.ico         # Website favicon
│   ├── globals.css         # Global styles with Tailwind v4
│   ├── layout.tsx          # Root layout with fonts and metadata
│   └── page.tsx            # Home page
│
├── components/              # React components (to be created)
│   └── ui/                 # shadcn/ui components
│
├── lib/                     # Utility functions (to be created)
│   └── utils.ts            # Helper utilities
│
├── types/                   # TypeScript type definitions (to be created)
│
├── prisma/                  # Prisma schema and migrations (to be created)
│   └── schema.prisma       # Database schema
│
├── public/                  # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .gitignore              # Git ignore rules
├── CLAUDE.md               # AI assistant guidelines
├── README.md               # This file
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 💻 Development

### Code Style & Conventions

#### File Naming
- **Components:** kebab-case (e.g., `transaction-card.tsx`)
- **Pages:** lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.ts`)
- **Types:** PascalCase (e.g., `Transaction.ts`)

#### Import Order
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

#### Path Aliases

Use the `@/` alias for cleaner imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

// ❌ Avoid
import { Button } from '../../../components/ui/button'
```

### TypeScript Guidelines

- Always use TypeScript (no `.js` or `.jsx` files)
- Provide explicit types for function parameters and return values
- Prefer interfaces over types for object shapes
- Avoid using `any` - use `unknown` if type is truly unknown
- Leverage type inference where obvious

Example:
```typescript
// ✅ Good
interface Transaction {
  id: string
  amount: number
  category: string
  date: Date
}

async function getTransactions(userId: string): Promise<Transaction[]> {
  // implementation
}

// ❌ Avoid
function getTransactions(userId: any): any {
  // implementation
}
```

### React Best Practices

#### Server Components (Default)
```typescript
// app/transactions/page.tsx
export default async function TransactionsPage() {
  // Can directly fetch data
  const transactions = await fetchTransactions()

  return <div>{/* render */}</div>
}
```

#### Client Components
```typescript
'use client'  // Must be first line

import { useState } from 'react'

export default function InteractiveComponent() {
  const [state, setState] = useState()

  return <div>{/* render */}</div>
}
```

## 🗄 Database Setup

This project uses [Prisma](https://www.prisma.io/) as the ORM for database management with PostgreSQL.

### Initial Setup

1. **Install Prisma** (if not already installed):
```bash
npm install prisma @prisma/client
```

2. **Initialize Prisma**:
```bash
npx prisma init
```

3. **Configure Database Connection**

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/ai_finance_copilot"
```

4. **Define Your Schema**

Edit `prisma/schema.prisma` to include your models:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  accounts  Account[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id           String        @id @default(cuid())
  name         String
  type         String
  balance      Decimal       @db.Decimal(10, 2)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Decimal  @db.Decimal(10, 2)
  description String?
  date        DateTime
  accountId   String
  account     Account  @relation(fields: [accountId], references: [id])
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id           String        @id @default(cuid())
  name         String
  type         String        // 'income' or 'expense'
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Budget {
  id         String   @id @default(cuid())
  name       String
  amount     Decimal  @db.Decimal(10, 2)
  period     String   // 'monthly', 'yearly', etc.
  categoryId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

5. **Run Migrations**:
```bash
npx prisma migrate dev --name init
```

6. **Generate Prisma Client**:
```bash
npx prisma generate
```

### Prisma Client Singleton

Create `lib/prisma.ts` for the Prisma client singleton:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Using Prisma in Your Code

```typescript
import { prisma } from '@/lib/prisma'

// Example: Fetch all transactions for a user
const transactions = await prisma.transaction.findMany({
  where: {
    account: {
      userId: 'user-id'
    }
  },
  include: {
    category: true,
    account: true
  },
  orderBy: {
    date: 'desc'
  }
})
```

### Useful Prisma Commands

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:push": "prisma db push",
    "prisma:studio": "prisma studio",
    "prisma:seed": "prisma db seed"
  }
}
```

Then run:
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:push` - Push schema changes without migrations
- `npm run prisma:studio` - Open Prisma Studio (GUI for database)
- `npm run prisma:seed` - Seed the database with initial data

## 🎨 UI Components

This project uses **[shadcn/ui](https://ui.shadcn.com/)** as the primary component library. All UI components are built using shadcn components for consistency and accessibility.

### Available Components

The project includes pre-installed shadcn components:

- **Layout:** Card, Separator, Aspect Ratio, Breadcrumb
- **Forms:** Button, Input, Checkbox, Select, Radio Group, Switch, Slider, Textarea, Label
- **Navigation:** Tabs, Accordion, Collapsible, Dropdown Menu, Navigation Menu
- **Feedback:** Alert, Dialog, Toast, Tooltip, Popover
- **Data Display:** Table, Avatar, Badge, Calendar, Chart, Progress, Skeleton

### Using Components

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function TransactionCard({ amount, category }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
        <Button variant="outline">View Details</Button>
      </CardContent>
    </Card>
  )
}
```

### Installing New Components

To add additional shadcn components:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add form
npx shadcn@latest add data-table
npx shadcn@latest add date-picker
```

### Component Guidelines

- **DO** use shadcn components as the foundation for all UI elements
- **DO** customize components with Tailwind CSS classes
- **DO NOT** create custom UI components from scratch if a shadcn component exists
- **DO** use the `cn()` utility from `@/lib/utils` for conditional classes

## 🔐 Environment Variables

Create a `.env` file in the root directory (this file is gitignored):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_finance_copilot"

# Authentication (when implemented)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI API Keys (when implemented)
OPENAI_API_KEY="your-openai-key"
```

**Important:** Never commit the `.env` file to version control. Use `.env.example` for documentation.

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Building
npm run build        # Build the application for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint to check code quality

# Prisma (add these to package.json)
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eric-nichols-nyc/ai-finance-copilot)

### Other Deployment Options

- **Netlify** - Alternative serverless platform
- **AWS Amplify** - AWS-managed hosting
- **Docker** - Self-hosted containerized deployment
- **DigitalOcean App Platform** - Managed container service

### Environment Variables for Production

Make sure to configure these in your deployment platform:
- `DATABASE_URL` - Production database connection string
- `NEXTAUTH_URL` - Production URL
- `NEXTAUTH_SECRET` - Secure secret for authentication
- Any other API keys required

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the code style guidelines
4. **Run linting**: `npm run lint`
5. **Test your changes** thoroughly
6. **Commit your changes**: `git commit -m 'Add some feature'`
7. **Push to the branch**: `git push origin feature/your-feature-name`
8. **Open a Pull Request**

### Code Review Process

- All submissions require review before merging
- PRs should include a clear description of changes
- Keep PRs focused on a single feature or fix
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Fonts by [Vercel](https://vercel.com/font)

## 📞 Support

For questions or support, please:
- Open an issue on GitHub
- Review the [CLAUDE.md](CLAUDE.md) file for development guidelines
- Check [Next.js documentation](https://nextjs.org/docs)

---

**Made with ❤️ by the AI Finance Copilot Team**

# Quickstart Guide

Get AI Finance Copilot running locally in **5 minutes**.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org/))
- **PostgreSQL** database (local or hosted)
- **Supabase account** for authentication ([sign up](https://supabase.com))
- **Anthropic API key** for AI features ([get key](https://console.anthropic.com))

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/ai-finance-copilot.git
cd ai-finance-copilot

# Install dependencies
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/ai_finance_copilot"

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-your-key"
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
4. Copy your **anon/public key** (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Getting Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to **API Keys**
4. Click **Create Key** and copy it

## Step 3: Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

**What gets seeded:**
- Demo user account
- Sample categories (Groceries, Rent, Utilities, etc.)
- Sample accounts (checking, savings, credit card)
- Sample transactions (last 90 days)
- Sample recurring charges (Netflix, Spotify, etc.)

## Step 4: Configure Supabase Authentication

### Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional but recommended)

### Create Your First User

You have two options:

**Option A: Use the seeded demo user**
```
Email: demo@example.com
Password: Create this user in Supabase dashboard
```

**Option B: Sign up through the app**
1. Start the dev server (next step)
2. Navigate to `/sign-in`
3. Create a new account

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Sign In

1. Navigate to [http://localhost:3000/sign-in](http://localhost:3000/sign-in)
2. Sign in with your Supabase credentials
3. You'll be redirected to the dashboard

## Verify Everything Works

### Check the Dashboard
- You should see summary cards with data
- Credit cards, loans, and recurring payments should be visible
- Charts should render without errors

### Test Transactions
1. Go to **Accounts** in the sidebar
2. Click on any account
3. You should see transaction history
4. Try creating a new transaction

### Test AI Chat
1. Look for the AI chat button (typically in the sidebar or header)
2. Open the chat panel
3. Ask: "What were my expenses last month?"
4. The AI should respond with data from your transactions

### Test Search
1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Search for a transaction or account
3. Results should appear instantly

## Common Issues

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Make sure PostgreSQL is running
2. Verify `DATABASE_URL` in `.env` is correct
3. Test connection: `npx prisma db pull`

### Supabase Auth Error

**Error:** `Invalid API key` or `Network request failed`

**Solution:**
1. Verify Supabase URL and anon key in `.env`
2. Check that Supabase project is active
3. Ensure email provider is enabled in Supabase dashboard

### Prisma Generate Error

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
# Delete generated files and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

## Development Tools

### Prisma Studio
Visual database editor:

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555)

### React Query DevTools
Automatically available in development mode. Look for the React Query icon in the bottom corner of the app.

### TypeScript Type Checking
```bash
# Check types without building
npx tsc --noEmit
```

## Next Steps

Now that you're running locally:

1. **Explore the app** - Click through all features
2. **Read the architecture docs** - [System Design](../architecture/system-design.md)
3. **Understand data flow** - [Data Flow](../architecture/data-flow.md)
4. **Learn the patterns** - [Patterns](../architecture/patterns.md)
5. **Run the tests** - `npm test`

## Quick Reference

### Development Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

### Database Commands

```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create and apply migration
npx prisma migrate reset # Reset database (caution!)
npx prisma studio        # Open Prisma Studio
npx prisma db seed       # Seed database
npx prisma db push       # Push schema without migration
```

### Testing Commands

```bash
npm test                 # Run unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Playwright UI mode
npm run test:all         # All tests
```

## Useful URLs

- **App:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555 (when running)
- **Supabase Dashboard:** https://app.supabase.com
- **Anthropic Console:** https://console.anthropic.com

## Need Help?

- **Setup issues?** Check [Common Issues](#common-issues) above
- **Understanding the code?** Read [System Design](../architecture/system-design.md)
- **Testing questions?** See [Testing Guide](../guides/testing.md)
- **Feature questions?** Check `docs/features/` directory

---

**Ready to build?** Head to [System Design](../architecture/system-design.md) to understand the architecture.

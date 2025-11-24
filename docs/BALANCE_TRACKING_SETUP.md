# Balance Tracking Setup Instructions

This document provides step-by-step instructions for setting up the account balance tracking feature.

## What Was Implemented

The balance tracking system allows you to:
- **Track account balances over time** - Automatically record snapshots whenever transactions change
- **View historical balance charts** - See how your account balances have changed over different time periods (1W, 1M, 3M, YTD, 1Y, ALL)
- **Monitor credit card balances** - Track credit card debt and utilization over time
- **Export data** - Ready for future enhancements like CSV exports and analytics

## Files Changed/Created

### Database Schema
- ✅ `prisma/schema.prisma` - Added `AccountBalanceSnapshot` model

### Server Actions
- ✅ `actions/record-balance-snapshot.ts` - New action to record balance snapshots
- ✅ `actions/get-account-balance-history.ts` - New action to fetch balance history for charts
- ✅ `actions/create-transaction.ts` - Updated to record snapshots after creating transactions
- ✅ `actions/update-transaction.ts` - Updated to record snapshots after updating transactions
- ✅ `actions/delete-transaction.ts` - Updated to record snapshots after deleting transactions

### UI Components
- ✅ `app/(authenticated)/accounts/_components/account-detail-chart.tsx` - Updated to use real balance history data instead of mock data

### Documentation
- ✅ `docs/BALANCE_TRACKING.md` - Comprehensive documentation about the system
- ✅ `docs/BALANCE_TRACKING_SETUP.md` - This setup guide

## Setup Steps

### Step 1: Run Database Migration

Run the Prisma migration to create the new `AccountBalanceSnapshot` table:

```bash
npm run prisma:migrate
```

This will:
- Create a migration file in `prisma/migrations/`
- Apply the migration to your database
- Add the `AccountBalanceSnapshot` table

**Alternative (if the npm script doesn't work):**
```bash
npx prisma migrate dev --name add-account-balance-snapshots
```

### Step 2: Generate Prisma Client

Update the Prisma client to include the new model:

```bash
npm run prisma:generate
```

**Alternative:**
```bash
npx prisma generate
```

### Step 3: Restart Your Development Server

If your dev server is running, restart it to pick up the new Prisma client:

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

### Step 4: Create Initial Snapshots (Optional but Recommended)

For existing accounts, create initial balance snapshots. You can do this in several ways:

#### Option A: Via Browser Console (Quick Test)

1. Go to your accounts page while logged in
2. Open browser console (F12)
3. Run this code:

```javascript
// Import the action
const { recordAllBalanceSnapshots } = await import('/actions/record-balance-snapshot')

// Record snapshots for all your accounts
// Note: You'll need your user ID - you can get it from your session
console.log('Creating snapshots...')
// This won't work directly in browser - use Option B or C instead
```

#### Option B: Create a Simple Script (Recommended)

Create a file `scripts/create-initial-snapshots.ts`:

```typescript
import { prisma } from '@/lib/prisma'
import { recordAllBalanceSnapshots } from '@/actions/record-balance-snapshot'

async function main() {
  console.log('Creating initial balance snapshots...')

  // Get all users
  const users = await prisma.user.findMany()

  for (const user of users) {
    console.log(`Processing user: ${user.email}`)
    const result = await recordAllBalanceSnapshots(user.id)

    if (result.success) {
      console.log(`  ✓ Created ${result.count} snapshots`)
    } else {
      console.error(`  ✗ Error: ${result.error}`)
    }
  }

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
npx tsx scripts/create-initial-snapshots.ts
```

#### Option C: Just Use the App (Easiest)

Simply create, update, or delete any transaction on each account:
- The snapshot will be created automatically
- Charts will start showing data immediately
- No manual intervention needed

### Step 5: Test the Feature

1. **Navigate to the Accounts page** in your app
2. **Select an account** to view its details
3. **Check the chart** - You should see:
   - A loading state while fetching data
   - Your account balance plotted over time
   - Time period selector (1W, 1M, 3M, etc.)

4. **Create a new transaction** on the account
5. **Refresh the page** - The chart should update with the new balance

### Step 6: Verify Database

Check that snapshots are being created:

```bash
npx prisma studio
```

Then:
1. Open the `AccountBalanceSnapshot` table
2. You should see records with `accountId`, `balance`, and `date` values

## Example Data Flow

Here's what happens when you create a transaction:

```
1. User submits transaction form
   ↓
2. createTransaction() action runs
   ↓
3. Transaction saved to database
   ↓
4. Account balance updated
   ↓
5. recordBalanceSnapshot() called automatically
   ↓
6. Snapshot saved with today's date and current balance
   ↓
7. Pages revalidated
   ↓
8. Chart component refetches data
   ↓
9. New balance data point appears on chart
```

## Sample Chart Data Response

Once snapshots exist, the API will return data like this:

```json
{
  "success": true,
  "data": [
    { "date": "Oct 25", "balance": 2450.75 },
    { "date": "Oct 26", "balance": 2680.20 },
    { "date": "Oct 27", "balance": 2515.50 },
    { "date": "Oct 28", "balance": 2620.00 },
    { "date": "Nov 24", "balance": 3125.00 }
  ]
}
```

This data is automatically plotted on the chart component.

## Troubleshooting

### Issue: Charts show "No balance history available yet"

**Solution:**
- You need to create at least one snapshot for the account
- Either:
  - Create/update/delete a transaction on that account
  - Run the initial snapshots script (Step 4)
  - Manually call `recordBalanceSnapshot(accountId)`

### Issue: Migration fails with "relation already exists"

**Solution:**
- The table might already exist from a previous migration attempt
- Check your database with `npx prisma studio`
- If the table exists but is empty, skip to Step 2
- If you need a fresh start, you can reset: `npx prisma migrate reset` (⚠️ WARNING: This deletes all data!)

### Issue: TypeScript errors about `AccountBalanceSnapshot`

**Solution:**
- Make sure you ran `npm run prisma:generate`
- Restart your TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Check that the Prisma client output path is correct in `schema.prisma` (line 6)

### Issue: Charts load but show empty data

**Solution:**
- Check the browser console for errors
- Verify snapshots exist: `npx prisma studio` → `AccountBalanceSnapshot` table
- Make sure the date range matches your snapshots (try selecting "ALL" time period)

### Issue: Old transactions don't show in chart

**Solution:**
- Snapshots are only created going forward from when you implemented this feature
- Historical data requires backfilling
- You can backfill by running the initial snapshots script for past dates (see Step 4, Option B)

## Daily Snapshot Recommendations

For production deployments, set up a daily cron job to capture balance snapshots:

**Using Vercel Cron:**

1. Create `app/api/cron/daily-snapshots/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recordAllBalanceSnapshots } from '@/actions/record-balance-snapshot'

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel provides this)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany()
    let totalSnapshots = 0

    for (const user of users) {
      const result = await recordAllBalanceSnapshots(user.id)
      if (result.success) {
        totalSnapshots += result.count
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${totalSnapshots} snapshots`
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

2. Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-snapshots",
      "schedule": "0 0 * * *"
    }
  ]
}
```

3. Set `CRON_SECRET` environment variable in Vercel dashboard

## Next Steps

Now that balance tracking is set up, you can:

1. **Monitor your balances** - Check how your accounts change over time
2. **Track credit card usage** - See utilization trends
3. **Export data** - Future feature: export balance history to CSV
4. **Add alerts** - Future feature: get notified of significant balance changes
5. **Build dashboards** - Use `getMultipleAccountsBalanceHistory()` for net worth charts

## Additional Resources

- Full documentation: [`docs/BALANCE_TRACKING.md`](./BALANCE_TRACKING.md)
- Prisma schema: `prisma/schema.prisma` (lines 176-196)
- Example usage: `app/(authenticated)/accounts/_components/account-detail-chart.tsx`

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the full documentation in `docs/BALANCE_TRACKING.md`
3. Check the browser console for client-side errors
4. Check server logs for API errors
5. Verify database state with `npx prisma studio`

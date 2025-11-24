# Account Balance Tracking System

## Overview

The AI Finance Copilot application includes a comprehensive balance tracking system that records account balance snapshots over time. This allows users to view historical balance trends and chart their account balances across different time periods.

## Architecture

### Database Schema

The balance tracking system uses the `AccountBalanceSnapshot` model to store historical balance data:

```prisma
model AccountBalanceSnapshot {
  id        String   @id @default(cuid())
  balance   Decimal  // The account balance at this point in time
  date      DateTime // The date/time this balance was recorded

  accountId String
  userId    String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  account   Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([accountId, date]) // One snapshot per account per date
  @@index([userId])
  @@index([accountId, date])
}
```

**Key Features:**
- **Unique constraint**: One snapshot per account per date (prevents duplicate snapshots)
- **Indexed queries**: Optimized for fetching balance history by account and date range
- **Cascade deletion**: Snapshots are automatically deleted when accounts are deleted

### When Snapshots Are Created

Balance snapshots are automatically recorded in the following scenarios:

1. **After creating a transaction** (`create-transaction.ts:191`)
   - Records the new balance after the transaction is applied

2. **After updating a transaction** (`update-transaction.ts:236`)
   - Records the updated balance after the transaction changes

3. **After deleting a transaction** (`delete-transaction.ts:164`)
   - Records the balance after the transaction is removed

4. **Manual snapshots** (via `recordBalanceSnapshot()` function)
   - Can be called directly for backfilling or scheduled jobs

### Snapshot Logic

The system uses `upsert` operations to handle duplicate snapshots gracefully:

```typescript
await prisma.accountBalanceSnapshot.upsert({
  where: {
    accountId_date: {
      accountId: account.id,
      date: snapshotDate,
    },
  },
  update: {
    balance: snapshotBalance,
  },
  create: {
    accountId: account.id,
    userId: account.userId,
    balance: snapshotBalance,
    date: snapshotDate,
  },
})
```

This ensures:
- If a snapshot exists for the date, it's updated with the latest balance
- If no snapshot exists, a new one is created
- No errors occur from duplicate snapshot attempts

## API / Server Actions

### `recordBalanceSnapshot(accountId, balance?, date?)`

Records a balance snapshot for a specific account.

**Parameters:**
- `accountId` (string, required) - The account ID
- `balance` (number, optional) - The balance to record (defaults to current account balance)
- `date` (Date, optional) - The date for the snapshot (defaults to today)

**Returns:**
```typescript
{ success: boolean; error?: string }
```

**Example:**
```typescript
import { recordBalanceSnapshot } from '@/actions/record-balance-snapshot'

// Record snapshot with current balance
await recordBalanceSnapshot('account_id')

// Record snapshot with specific balance
await recordBalanceSnapshot('account_id', 5000.00)

// Record snapshot for a specific date
await recordBalanceSnapshot('account_id', 5000.00, new Date('2024-01-01'))
```

### `recordAllBalanceSnapshots(userId, date?)`

Records balance snapshots for all accounts belonging to a user.

**Parameters:**
- `userId` (string, required) - The user ID
- `date` (Date, optional) - The date for snapshots (defaults to today)

**Returns:**
```typescript
{ success: boolean; count: number; error?: string }
```

**Use Cases:**
- Daily batch jobs to snapshot all accounts
- Initial data population
- Backfilling historical data

**Example:**
```typescript
import { recordAllBalanceSnapshots } from '@/actions/record-balance-snapshot'

// Snapshot all accounts for today
const result = await recordAllBalanceSnapshots('user_id')
console.log(`Recorded ${result.count} snapshots`)
```

### `getAccountBalanceHistory(accountId, timePeriod)`

Fetches balance history for a single account over a specified time period.

**Parameters:**
- `accountId` (string, required) - The account ID
- `timePeriod` (TimePeriod, optional) - Time period: `'1W'`, `'1M'`, `'3M'`, `'YTD'`, `'1Y'`, `'ALL'` (default: `'1M'`)

**Returns:**
```typescript
{
  success: boolean
  data?: Array<{ date: string; balance: number }>
  error?: string
}
```

**Example:**
```typescript
import { getAccountBalanceHistory } from '@/actions/get-account-balance-history'

const result = await getAccountBalanceHistory('account_id', '3M')

if (result.success) {
  console.log(result.data)
  // [
  //   { date: 'Oct 25', balance: 2450.75 },
  //   { date: 'Oct 26', balance: 2680.20 },
  //   ...
  // ]
}
```

### `getMultipleAccountsBalanceHistory(accountIds, timePeriod)`

Fetches combined balance history for multiple accounts (sums balances by date).

**Parameters:**
- `accountIds` (string[], required) - Array of account IDs
- `timePeriod` (TimePeriod, optional) - Time period (default: `'1M'`)

**Returns:**
```typescript
{
  success: boolean
  data?: Array<{ date: string; balance: number }>
  error?: string
}
```

**Use Cases:**
- Total net worth charts
- Combined asset overview
- Multi-account trend analysis

**Example:**
```typescript
import { getMultipleAccountsBalanceHistory } from '@/actions/get-account-balance-history'

const accountIds = ['acc_1', 'acc_2', 'acc_3']
const result = await getMultipleAccountsBalanceHistory(accountIds, '1Y')

if (result.success) {
  // result.data contains sum of all account balances per date
}
```

## UI Components

### AccountDetailChart

The `AccountDetailChart` component displays balance history for a single account with interactive time period selection.

**Location:** `app/(authenticated)/accounts/_components/account-detail-chart.tsx`

**Features:**
- Real-time balance history loading
- Time period selector (1W, 1M, 3M, YTD, 1Y, ALL)
- Loading states
- Error handling with fallback to current balance
- Credit utilization display for credit cards

**Usage:**
```typescript
import { AccountDetailChart } from '@/app/(authenticated)/accounts/_components/account-detail-chart'

<AccountDetailChart account={selectedAccount} />
```

**Props:**
```typescript
type AccountDetailChartProps = {
  account: {
    id: string
    name: string
    type: string
    balance: number
    creditLimit?: number
  } | null
}
```

## Data Flow

### Transaction Creation Flow

```
User creates transaction
  ↓
Transaction saved to database
  ↓
Account balance updated
  ↓
recordBalanceSnapshot() called
  ↓
Snapshot upserted for today's date
  ↓
Pages revalidated
  ↓
Chart component refetches balance history
  ↓
UI updates with new data point
```

### Chart Loading Flow

```
User selects account or changes time period
  ↓
useEffect triggered in AccountDetailChart
  ↓
getAccountBalanceHistory() called
  ↓
Query AccountBalanceSnapshot table
  ↓
Transform data for chart format
  ↓
Update chartData state
  ↓
Recharts renders updated visualization
```

## Time Periods

The system supports the following time periods:

| Period | Description | Date Range |
|--------|-------------|------------|
| `1W` | 1 Week | Last 7 days |
| `1M` | 1 Month | Last 30 days |
| `3M` | 3 Months | Last 90 days |
| `YTD` | Year to Date | January 1 to today |
| `1Y` | 1 Year | Last 365 days |
| `ALL` | All Time | Account creation to today |

## Maintenance & Operations

### Backfilling Historical Data

If you have existing accounts without balance snapshots, you can backfill them:

```typescript
import { recordAllBalanceSnapshots } from '@/actions/record-balance-snapshot'

// Backfill for today
await recordAllBalanceSnapshots(userId)

// Backfill for specific dates
for (let i = 0; i < 30; i++) {
  const date = new Date()
  date.setDate(date.getDate() - i)
  await recordAllBalanceSnapshots(userId, date)
}
```

**Note:** Backfilled snapshots will use the **current** account balance for all dates. For accurate historical data, you would need to calculate balances from transaction history.

### Daily Snapshot Jobs (Recommended)

For production use, set up a daily cron job to snapshot all accounts:

```typescript
// Example cron job (Node.js)
import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { recordAllBalanceSnapshots } from '@/actions/record-balance-snapshot'

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily balance snapshots...')

  // Get all users
  const users = await prisma.user.findMany()

  // Snapshot accounts for each user
  for (const user of users) {
    const result = await recordAllBalanceSnapshots(user.id)
    console.log(`User ${user.email}: ${result.count} snapshots recorded`)
  }

  console.log('Daily balance snapshots complete')
})
```

### Database Cleanup

Balance snapshots accumulate over time. Consider implementing a cleanup policy:

```typescript
// Example: Delete snapshots older than 2 years
await prisma.accountBalanceSnapshot.deleteMany({
  where: {
    date: {
      lt: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
    }
  }
})
```

## Performance Considerations

### Query Optimization

1. **Indexed queries**: The `accountId` and `date` fields are indexed for fast lookups
2. **Date range filtering**: Always query with date ranges to limit result sets
3. **Limit time periods**: Very long time periods (e.g., `ALL`) may return large datasets

### Storage

- Each snapshot is ~50-100 bytes (ID, balance, dates, foreign keys)
- Daily snapshots for 1 account for 1 year = ~365 snapshots = ~36 KB
- 100 accounts × 1 year = ~3.6 MB
- Storage is minimal and scales linearly

### Aggregation

For dashboard summary charts, use `getMultipleAccountsBalanceHistory()` which aggregates on the database side rather than fetching all snapshots and summing client-side.

## Troubleshooting

### No data showing in charts

**Possible causes:**
1. No snapshots exist yet (new accounts)
2. Time period selected has no snapshots
3. Database migration not run

**Solutions:**
```typescript
// Check if snapshots exist
const count = await prisma.accountBalanceSnapshot.count({
  where: { accountId: 'your_account_id' }
})
console.log(`Found ${count} snapshots`)

// Create initial snapshot
await recordBalanceSnapshot('your_account_id')
```

### Duplicate snapshot errors

The system uses `upsert` with a unique constraint, so duplicates should not cause errors. If you see errors, verify:
1. Database migration was successful
2. Unique constraint `@@unique([accountId, date])` exists

### Inaccurate historical balances

If backfilled snapshots show incorrect historical balances:
1. Snapshots use **current** balance, not historical balance
2. For accurate history, calculate from transaction history:

```typescript
// Calculate balance at specific date
const transactions = await prisma.transaction.findMany({
  where: {
    accountId: 'account_id',
    date: { lte: targetDate }
  }
})

let historicalBalance = initialBalance
transactions.forEach(t => {
  // Apply transaction logic to calculate balance
})

await recordBalanceSnapshot('account_id', historicalBalance, targetDate)
```

## Migration Instructions

To add balance tracking to your database:

1. **Run the Prisma migration:**
   ```bash
   npm run prisma:migrate
   ```
   Or manually:
   ```bash
   npx prisma migrate dev --name add-account-balance-snapshots
   ```

2. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

3. **Create initial snapshots for existing accounts:**
   ```typescript
   import { prisma } from '@/lib/prisma'
   import { recordAllBalanceSnapshots } from '@/actions/record-balance-snapshot'

   const users = await prisma.user.findMany()
   for (const user of users) {
     await recordAllBalanceSnapshots(user.id)
   }
   ```

4. **Verify the feature:**
   - Create a transaction
   - Check that a snapshot was created
   - View the account chart to see the data point

## Future Enhancements

Potential improvements to the balance tracking system:

1. **Hourly snapshots** for day-trading or high-frequency accounts
2. **Calculated vs. actual balance tracking** to detect discrepancies
3. **Balance projections** based on recurring transactions
4. **Comparison charts** showing multiple accounts side-by-side
5. **Export functionality** to download balance history as CSV
6. **Alerts** for significant balance changes
7. **Budget vs. actual** overlays on balance charts
8. **Predictive analytics** using machine learning on balance trends

## Related Files

- `prisma/schema.prisma` - Database schema definition
- `actions/record-balance-snapshot.ts` - Snapshot recording logic
- `actions/get-account-balance-history.ts` - Balance history fetching
- `actions/create-transaction.ts` - Transaction creation with snapshot
- `actions/update-transaction.ts` - Transaction update with snapshot
- `actions/delete-transaction.ts` - Transaction deletion with snapshot
- `app/(authenticated)/accounts/_components/account-detail-chart.tsx` - Chart UI component

# Global Search Functionality

## Overview

The AI Finance Copilot now includes a comprehensive global search functionality powered by shadcn's Command component. This feature allows users to quickly search across all financial entities using a command palette interface.

## Features

### ✨ Key Capabilities

- **🔍 Unified Search**: Search across transactions, accounts, recurring charges, categories, budgets, and interest payments
- **⌨️ Keyboard Shortcuts**: Quick access via `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- **⚡ Real-time Search**: Debounced search with 300ms delay for optimal performance
- **📝 Recent Searches**: Automatically tracks your last 5 searches
- **🎯 Quick Actions**: Fast navigation and create actions built-in
- **💨 Loading States**: Visual feedback during search
- **📱 Responsive Design**: Works on all screen sizes

## Usage

### Opening the Search

There are two ways to open the global search:

1. **Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. **Search Button**: Click the search button in the sidebar header

### Search Syntax

#### Basic Text Search
```
netflix          → Finds all transactions, recurring charges containing "netflix"
groceries        → Searches descriptions and categories
chase            → Finds accounts and transactions related to Chase
```

#### Amount Search
```
50               → Finds transactions with exactly $50
100              → Finds transactions with exactly $100
```

#### Category/Type Search
```
food             → Finds all transactions in food category
credit card      → Finds all credit card accounts
monthly          → Finds monthly recurring charges and budgets
```

## Architecture

### Components

#### 1. **SearchProvider** (`lib/search-context.tsx`)
Manages global search state:
- Open/close state
- Search query
- Recent searches (stored in localStorage)

```typescript
import { useSearch } from '@/lib/search-context'

const { isOpen, query, openSearch, closeSearch, setQuery } = useSearch()
```

#### 2. **GlobalSearch** (`components/global-search.tsx`)
Main command dialog component that:
- Displays search results grouped by entity type
- Handles keyboard navigation
- Shows loading and empty states
- Manages recent searches

#### 3. **SearchTrigger** (`components/search-trigger.tsx`)
Button component to open search:
```typescript
<SearchTrigger variant="outline" showShortcut={true} />
```

#### 4. **Search API** (`app/api/search/route.ts`)
Backend endpoint that:
- Authenticates users
- Searches across all Prisma models
- Returns grouped results
- Supports filtering by entity types

#### 5. **useSearchResults Hook** (`hooks/use-search-results.ts`)
React Query hook that:
- Debounces search queries (300ms)
- Manages loading states
- Caches results (30 seconds)
- Provides type-safe results

## API Reference

### Search Endpoint

**GET** `/api/search`

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | required | Search query |
| `entities` | string | all | Comma-separated list of entities to search |
| `limit` | number | 5 | Max results per entity |

#### Example Requests

```bash
# Search all entities
GET /api/search?q=netflix

# Search only transactions and recurring
GET /api/search?q=subscription&entities=transactions,recurring

# Search with custom limit
GET /api/search?q=food&limit=10
```

#### Response Format

```typescript
{
  transactions: Array<{
    id: string
    amount: number
    description: string | null
    date: Date
    type: string
    category: { id: string; name: string } | null
    account: { id: string; name: string; type: string }
  }>
  accounts: Array<{
    id: string
    name: string
    type: string
    balance: number
    currency: string
    creditLimit?: number | null
    apr?: number | null
  }>
  recurring: Array<{
    id: string
    name: string
    amount: number
    frequency: string
    nextDueDate: Date
    category: { id: string; name: string }
    account: { id: string; name: string }
  }>
  categories: Array<{
    id: string
    name: string
    color: string | null
    icon: string | null
    _count: { transactions: number }
  }>
  budgets: Array<{
    id: string
    amount: number
    period: string
    startDate: Date
    endDate: Date | null
    category: { id: string; name: string } | null
  }>
  interestPayments: Array<{
    id: string
    amount: number
    date: Date
    month: number
    year: number
    account: { id: string; name: string }
  }>
}
```

## Search Features by Entity

### 💳 Transactions
- Searches: description, notes, category name, account name, type
- Shows: amount (with color coding), date, category, account
- Sorts: by date (descending)

### 🏦 Accounts
- Searches: name, type, currency
- Shows: balance, type, credit limit (if applicable)
- Includes: checking, savings, credit cards, loans, investments

### 🔄 Recurring Charges
- Searches: name, frequency, category, account
- Shows: amount, frequency, next due date, category
- Sorts: by next due date

### 🏷️ Categories
- Searches: name
- Shows: transaction count
- Useful for: finding categories to filter by

### 💰 Budgets
- Searches: period, category name
- Shows: amount, period, category
- Sorts: by start date (descending)

### 📈 Interest Payments
- Searches: account name
- Shows: amount, date, month/year
- Useful for: tracking credit card/loan interest

## Quick Actions

### Navigation Actions
- Dashboard
- Transactions
- Cash Flow
- Accounts
- Categories
- Recurring Charges
- Budgets
- Analytics

### Create Actions
- New Transaction
- New Account

### Utility Actions
- Settings
- Help & Support

## Performance Optimizations

### Debouncing
Search queries are debounced by 300ms to reduce API calls while typing.

### Caching
Results are cached for 30 seconds using React Query, improving performance for repeated searches.

### Minimum Query Length
Search only triggers when query is 2+ characters to avoid unnecessary requests.

### Result Limits
Default limit of 5 results per entity to keep responses fast and UI clean.

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Cmd+K` / `Ctrl+K` | Open/close search |
| `Esc` | Close search |
| `↑` / `↓` | Navigate results |
| `Enter` | Select result |
| `Tab` | Navigate between groups |

## Implementation Examples

### Adding Search to a New Page

```typescript
'use client'

import { useSearch } from '@/lib/search-context'
import { SearchTrigger } from '@/components/search-trigger'

export function MyPage() {
  const { openSearch } = useSearch()

  return (
    <div>
      {/* Button trigger */}
      <SearchTrigger />

      {/* Or custom button */}
      <button onClick={openSearch}>
        Search
      </button>
    </div>
  )
}
```

### Using Search Results in Custom Component

```typescript
'use client'

import { useSearchResults } from '@/hooks/use-search-results'

export function CustomSearch() {
  const { results, isLoading, totalResults } = useSearchResults({
    query: 'netflix',
    entities: ['transactions', 'recurring'],
    limit: 10,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Found {totalResults} results</p>
      {results.transactions.map(tx => (
        <div key={tx.id}>{tx.description}</div>
      ))}
    </div>
  )
}
```

## Future Enhancements

### Phase 3 (Enhanced Results) - Planned
- [ ] Dedicated result rendering components
- [ ] Rich result previews
- [ ] Result highlighting
- [ ] Export functionality

### Phase 4 (Advanced Features) - Planned
- [ ] Search filters (date range, amount range)
- [ ] Saved searches
- [ ] Search history analytics
- [ ] Natural language queries

### Phase 5 (AI-Powered) - Planned
- [ ] AI-powered search suggestions
- [ ] Semantic search
- [ ] Multi-language support
- [ ] Voice search

## Troubleshooting

### Search Not Working
1. Check if user is authenticated
2. Verify database connection
3. Check browser console for errors
4. Ensure Prisma client is generated

### No Results Found
1. Verify data exists in database
2. Check search query syntax
3. Try broader search terms
4. Verify entity types are included

### Slow Search Performance
1. Add database indexes (already added for common fields)
2. Reduce result limits
3. Narrow entity types
4. Check network latency

## Credits

Built with:
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [cmdk](https://cmdk.paco.me/) - Command palette primitive
- [React Query](https://tanstack.com/query) - Data fetching
- [Prisma](https://www.prisma.io/) - Database ORM

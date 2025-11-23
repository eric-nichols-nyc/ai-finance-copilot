# AI Chatbot Financial Data Integration

## Overview

The AI chatbot now has full access to your financial data through **function calling/tool use** instead of RAG. This provides accurate, real-time access to your structured financial data.

## How It Works

The chatbot uses Anthropic's Claude with **tool calling** to fetch data from your PostgreSQL database. When you ask a question, the AI:

1. Determines which tools to call based on your question
2. Executes the appropriate database queries
3. Analyzes the results
4. Provides insights and recommendations

**No RAG needed!** Your financial data is structured, so direct database queries through tools are more efficient and accurate.

## Available Tools

### 1. `getRecentTransactions`
Get recent transactions, optionally filtered by account.

**Example questions:**
- "Show me my recent transactions"
- "What are my last 20 transactions?"
- "Show transactions for my checking account"

### 2. `getAccountBalances`
Get all account balances and details.

**Example questions:**
- "What are my account balances?"
- "How much do I have across all accounts?"
- "Show me my credit card details"

### 3. `analyzeSpending`
Analyze spending by category for a specific time period.

**Example questions:**
- "What did I spend on groceries last month?"
- "Analyze my spending for the past 3 months"
- "Show me spending by category this year"

### 4. `getBudgetStatus`
Get current budget status and spending progress.

**Example questions:**
- "How am I doing on my budgets?"
- "Am I over budget in any categories?"
- "Show my budget progress"

### 5. `getRecurringCharges`
Get upcoming recurring charges and subscriptions.

**Example questions:**
- "What subscriptions do I have coming up?"
- "Show me recurring charges for the next 30 days"
- "List all my subscriptions"

### 6. `searchTransactions`
Search transactions by description, category, or date range.

**Example questions:**
- "Find all transactions at Starbucks"
- "Show me all dining expenses from last quarter"
- "Find transactions over $100"

### 7. `getCategories`
Get all expense categories.

**Example questions:**
- "What categories do I have?"
- "List my expense categories"

## Authentication

The chatbot automatically uses your authenticated session:
- User authentication handled via Supabase
- Each user only sees their own financial data
- Secure, session-based queries

## Technical Implementation

### API Route
Location: `/app/api/chat/route.ts`

The route:
1. Authenticates the user via Supabase
2. Gets the Prisma user ID
3. Configures Claude with financial data tools
4. Executes tool calls with user-scoped queries

### Tools Pattern
```typescript
tools: {
  toolName: tool({
    description: 'What this tool does',
    parameters: z.object({ /* Zod schema */ }),
    execute: async (params) => {
      // Query database with userId scope
      return results
    },
  }),
}
```

### Key Features
- **User-scoped queries**: All queries filter by `userId`
- **Type-safe**: Zod schemas for parameter validation
- **Streaming responses**: Real-time AI responses
- **Error handling**: Graceful error messages

## Example Conversations

### Budget Analysis
```
User: How am I doing on my grocery budget this month?

AI: [Calls getBudgetStatus and analyzeSpending tools]
You've spent $342 on groceries so far this month, which is 68% of your $500 budget. You have $158 remaining with 10 days left in the month. You're on track!
```

### Spending Insights
```
User: What were my top 3 spending categories last month?

AI: [Calls analyzeSpending tool with last month's dates]
Your top 3 spending categories last month were:
1. Groceries: $487
2. Dining: $312
3. Transportation: $245

Total spending: $1,044 across all categories.
```

### Account Overview
```
User: Give me a summary of my accounts

AI: [Calls getAccountBalances tool]
You have 4 accounts:
- Main Checking: $2,450.00
- Savings: $15,320.00
- Chase Visa (Credit): -$1,205.00 (limit: $5,000)
- Car Loan: -$18,500.00 (monthly payment: $425)

Net worth: -$1,935.00
```

## When You WOULD Need RAG

RAG (Retrieval-Augmented Generation) would only be beneficial if you add:
- **Financial documents** (PDFs, statements, invoices)
- **Research/articles** about financial topics
- **Large unstructured text** data

For structured database queries (transactions, accounts, budgets), **function calling is the optimal approach**.

## Future Enhancements

Potential additions:
- `createBudget` - Create new budgets via chat
- `categorizeTransaction` - Auto-categorize transactions
- `getFinancialAdvice` - Personalized advice based on spending patterns
- `forecastSpending` - Predict future expenses
- `compareTimeperiods` - Compare spending across months/years
- `detectAnomalies` - Find unusual transactions

## Performance

Benefits of tool use over RAG:
- ✅ **Faster**: Direct SQL queries vs vector search
- ✅ **More accurate**: Exact data vs semantic similarity
- ✅ **Simpler**: No vector database needed
- ✅ **Cost-effective**: Fewer tokens used
- ✅ **Real-time**: Always current data

## Security

- All queries scoped to authenticated user
- No cross-user data leakage
- Supabase session validation
- Prisma parameterized queries (SQL injection safe)

import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get Prisma user
    const user = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
    })

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found in database.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const userId = user.id

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: `You are a helpful AI financial copilot assistant. You help users understand and manage their finances.

Your capabilities include:
- Answering questions about transactions, budgets, and spending patterns
- Providing financial insights and recommendations
- Analyzing spending by category and time period
- Checking account balances and recurring charges
- Helping with budget planning and tracking

You have access to tools to fetch real financial data for the user. Use these tools to provide accurate, data-driven insights.

Be concise, friendly, and focused on providing actionable financial advice. Always format currency values clearly (e.g., $1,234.56).`,
      messages,

      // Financial data tools
      tools: {
        getRecentTransactions: tool({
          description: 'Get recent transactions for the user. Optionally filter by account ID or limit the number of results.',
          parameters: z.object({
            limit: z.number().optional().describe('Number of transactions to return (default: 10)'),
            accountId: z.string().optional().describe('Filter by specific account ID'),
          }),
          execute: async ({ limit = 10, accountId }) => {
            const transactions = await prisma.transaction.findMany({
              where: {
                userId,
                ...(accountId ? { accountId } : {}),
              },
              take: limit,
              orderBy: { date: 'desc' },
              include: {
                category: {
                  select: {
                    name: true,
                    color: true,
                  },
                },
                account: {
                  select: {
                    name: true,
                    type: true,
                  },
                },
              },
            })

            return transactions.map((t) => ({
              id: t.id,
              amount: Number(t.amount),
              description: t.description,
              date: t.date.toISOString(),
              type: t.type,
              notes: t.notes,
              category: t.category?.name || 'Uncategorized',
              categoryColor: t.category?.color,
              account: t.account.name,
              accountType: t.account.type,
            }))
          },
        }),

        getAccountBalances: tool({
          description: 'Get all account balances and details for the user.',
          parameters: z.object({}),
          execute: async () => {
            const accounts = await prisma.account.findMany({
              where: { userId },
              select: {
                id: true,
                name: true,
                type: true,
                balance: true,
                currency: true,
                creditLimit: true,
                apr: true,
                remainingBalance: true,
                monthlyPayment: true,
              },
              orderBy: { name: 'asc' },
            })

            return accounts.map((a) => ({
              id: a.id,
              name: a.name,
              type: a.type,
              balance: Number(a.balance),
              currency: a.currency,
              creditLimit: a.creditLimit ? Number(a.creditLimit) : null,
              apr: a.apr ? Number(a.apr) : null,
              remainingBalance: a.remainingBalance ? Number(a.remainingBalance) : null,
              monthlyPayment: a.monthlyPayment ? Number(a.monthlyPayment) : null,
            }))
          },
        }),

        analyzeSpending: tool({
          description: 'Analyze spending by category for a specific time period.',
          parameters: z.object({
            startDate: z.string().describe('Start date in ISO format (YYYY-MM-DD)'),
            endDate: z.string().describe('End date in ISO format (YYYY-MM-DD)'),
          }),
          execute: async ({ startDate, endDate }) => {
            const transactions = await prisma.transaction.findMany({
              where: {
                userId,
                type: 'EXPENSE',
                date: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              include: {
                category: {
                  select: {
                    name: true,
                    color: true,
                  },
                },
              },
            })

            // Group by category
            const byCategory = transactions.reduce((acc, t) => {
              const catName = t.category?.name || 'Uncategorized'
              const catColor = t.category?.color || null
              if (!acc[catName]) {
                acc[catName] = {
                  category: catName,
                  color: catColor,
                  total: 0,
                  count: 0,
                }
              }
              acc[catName].total += Number(t.amount)
              acc[catName].count += 1
              return acc
            }, {} as Record<string, { category: string; color: string | null; total: number; count: number }>)

            const result = Object.values(byCategory).sort((a, b) => b.total - a.total)
            const totalSpending = result.reduce((sum, cat) => sum + cat.total, 0)

            return {
              categories: result,
              totalSpending,
              period: { startDate, endDate },
            }
          },
        }),

        getBudgetStatus: tool({
          description: 'Get current budget status and spending progress for all active budgets.',
          parameters: z.object({}),
          execute: async () => {
            const now = new Date()
            const budgets = await prisma.budget.findMany({
              where: {
                userId,
                startDate: { lte: now },
                OR: [
                  { endDate: null },
                  { endDate: { gte: now } },
                ],
              },
              include: {
                category: {
                  select: {
                    name: true,
                    color: true,
                  },
                },
              },
            })

            // Calculate spending for each budget
            const budgetStatus = await Promise.all(
              budgets.map(async (budget) => {
                const spending = await prisma.transaction.aggregate({
                  where: {
                    userId,
                    type: 'EXPENSE',
                    categoryId: budget.categoryId,
                    date: {
                      gte: budget.startDate,
                      lte: budget.endDate || now,
                    },
                  },
                  _sum: { amount: true },
                })

                const budgetAmount = Number(budget.amount)
                const spent = Number(spending._sum.amount || 0)
                const remaining = budgetAmount - spent
                const percentUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0

                return {
                  category: budget.category?.name || 'Overall',
                  categoryColor: budget.category?.color,
                  budget: budgetAmount,
                  spent,
                  remaining,
                  percentUsed: Math.round(percentUsed * 10) / 10,
                  period: budget.period,
                  startDate: budget.startDate.toISOString(),
                  endDate: budget.endDate?.toISOString() || null,
                  isOverBudget: spent > budgetAmount,
                }
              })
            )

            return budgetStatus
          },
        }),

        getRecurringCharges: tool({
          description: 'Get all recurring charges/subscriptions, optionally filtered by upcoming due dates.',
          parameters: z.object({
            daysAhead: z.number().optional().describe('Number of days ahead to look for upcoming charges (default: 30)'),
          }),
          execute: async ({ daysAhead = 30 }) => {
            const now = new Date()
            const futureDate = new Date()
            futureDate.setDate(futureDate.getDate() + daysAhead)

            const recurring = await prisma.recurringCharge.findMany({
              where: {
                userId,
                nextDueDate: {
                  gte: now,
                  lte: futureDate,
                },
              },
              include: {
                account: {
                  select: {
                    name: true,
                    type: true,
                  },
                },
                category: {
                  select: {
                    name: true,
                    color: true,
                  },
                },
              },
              orderBy: { nextDueDate: 'asc' },
            })

            const totalUpcoming = recurring.reduce((sum, r) => sum + Number(r.amount), 0)

            return {
              charges: recurring.map((r) => ({
                id: r.id,
                name: r.name,
                amount: Number(r.amount),
                frequency: r.frequency,
                nextDueDate: r.nextDueDate.toISOString(),
                account: r.account.name,
                category: r.category.name,
                categoryColor: r.category.color,
              })),
              totalUpcoming,
              daysAhead,
            }
          },
        }),

        searchTransactions: tool({
          description: 'Search transactions by description, category, or date range.',
          parameters: z.object({
            query: z.string().optional().describe('Search text to match in description'),
            category: z.string().optional().describe('Filter by category name'),
            type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER', 'INTEREST_CHARGE', 'LOAN_PAYMENT']).optional().describe('Transaction type'),
            startDate: z.string().optional().describe('Start date in ISO format'),
            endDate: z.string().optional().describe('End date in ISO format'),
            limit: z.number().optional().describe('Max results to return (default: 20)'),
          }),
          execute: async ({ query, category, type, startDate, endDate, limit = 20 }) => {
            const transactions = await prisma.transaction.findMany({
              where: {
                userId,
                ...(query ? {
                  OR: [
                    { description: { contains: query, mode: 'insensitive' } },
                    { notes: { contains: query, mode: 'insensitive' } },
                  ],
                } : {}),
                ...(category ? {
                  category: {
                    name: { equals: category, mode: 'insensitive' },
                  },
                } : {}),
                ...(type ? { type } : {}),
                ...(startDate || endDate ? {
                  date: {
                    ...(startDate ? { gte: new Date(startDate) } : {}),
                    ...(endDate ? { lte: new Date(endDate) } : {}),
                  },
                } : {}),
              },
              take: limit,
              orderBy: { date: 'desc' },
              include: {
                category: {
                  select: {
                    name: true,
                    color: true,
                  },
                },
                account: {
                  select: {
                    name: true,
                    type: true,
                  },
                },
              },
            })

            return {
              results: transactions.map((t) => ({
                id: t.id,
                amount: Number(t.amount),
                description: t.description,
                date: t.date.toISOString(),
                type: t.type,
                notes: t.notes,
                category: t.category?.name || 'Uncategorized',
                categoryColor: t.category?.color,
                account: t.account.name,
              })),
              count: transactions.length,
              searchCriteria: { query, category, type, startDate, endDate },
            }
          },
        }),

        getCategories: tool({
          description: 'Get all expense categories for the user.',
          parameters: z.object({}),
          execute: async () => {
            const categories = await prisma.category.findMany({
              where: { userId },
              select: {
                id: true,
                name: true,
                color: true,
                icon: true,
              },
              orderBy: { name: 'asc' },
            })

            return categories
          },
        }),
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export interface SearchResult {
  transactions: Array<{
    id: string
    amount: string // Prisma Decimal returned as string
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
    balance: string // Prisma Decimal returned as string
    currency: string
    creditLimit?: string | null // Prisma Decimal returned as string
    apr?: string | null // Prisma Decimal returned as string
  }>
  recurring: Array<{
    id: string
    name: string
    amount: string // Prisma Decimal returned as string
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
    amount: string // Prisma Decimal returned as string
    period: string
    startDate: Date
    endDate: Date | null
    category: { id: string; name: string } | null
  }>
  interestPayments: Array<{
    id: string
    amount: string // Prisma Decimal returned as string
    date: Date
    month: number
    year: number
    account: { id: string; name: string }
  }>
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim()
    const entities = searchParams.get('entities')?.split(',') || [
      'transactions',
      'accounts',
      'recurring',
      'categories',
      'budgets',
      'interestPayments',
    ]
    const limit = parseInt(searchParams.get('limit') || '5')

    // If no query, return empty results
    if (!query) {
      return NextResponse.json({
        transactions: [],
        accounts: [],
        recurring: [],
        categories: [],
        budgets: [],
        interestPayments: [],
      })
    }

    // Initialize results
    const results: SearchResult = {
      transactions: [],
      accounts: [],
      recurring: [],
      categories: [],
      budgets: [],
      interestPayments: [],
    }

    // Search transactions
    if (entities.includes('transactions')) {
      const numericQuery = parseFloat(query)
      const isNumeric = !isNaN(numericQuery)

      results.transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id,
          OR: [
            // Search by description
            { description: { contains: query, mode: 'insensitive' } },
            // Search by notes
            { notes: { contains: query, mode: 'insensitive' } },
            // Search by category name
            { category: { name: { contains: query, mode: 'insensitive' } } },
            // Search by account name
            { account: { name: { contains: query, mode: 'insensitive' } } },
            // Search by amount if numeric
            ...(isNumeric ? [{ amount: { equals: numericQuery } }] : []),
            // Search by type
            { type: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          category: { select: { id: true, name: true } },
          account: { select: { id: true, name: true, type: true } },
        },
        orderBy: { date: 'desc' },
        take: limit,
      })
    }

    // Search accounts
    if (entities.includes('accounts')) {
      console.log('Searching accounts with query:', query, 'userId:', user.id)

      // Debug: Check total accounts for this user
      const totalAccounts = await prisma.account.count({ where: { userId: user.id } })
      console.log('Total accounts for user:', totalAccounts)

      // Debug: Get all account names for this user
      const allAccounts = await prisma.account.findMany({
        where: { userId: user.id },
        select: { name: true },
      })
      console.log('All account names:', allAccounts.map(a => a.name))

      results.accounts = await prisma.account.findMany({
        where: {
          userId: user.id,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { type: { contains: query, mode: 'insensitive' } },
            { currency: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          currency: true,
          creditLimit: true,
          apr: true,
        },
        take: limit,
      })
      console.log('Found accounts:', results.accounts.length)
    }

    // Search recurring charges
    if (entities.includes('recurring')) {
      results.recurring = await prisma.recurringCharge.findMany({
        where: {
          userId: user.id,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { frequency: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } },
            { account: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        include: {
          category: { select: { id: true, name: true } },
          account: { select: { id: true, name: true } },
        },
        orderBy: { nextDueDate: 'asc' },
        take: limit,
      })
    }

    // Search categories
    if (entities.includes('categories')) {
      results.categories = await prisma.category.findMany({
        where: {
          userId: user.id,
          name: { contains: query, mode: 'insensitive' },
        },
        include: {
          _count: { select: { transactions: true } },
        },
        take: limit,
      })
    }

    // Search budgets
    if (entities.includes('budgets')) {
      results.budgets = await prisma.budget.findMany({
        where: {
          userId: user.id,
          OR: [
            { period: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        include: {
          category: { select: { id: true, name: true } },
        },
        orderBy: { startDate: 'desc' },
        take: limit,
      })
    }

    // Search interest payments
    // TEMP: Disabled until Prisma client is regenerated with InterestPayment model
    // if (entities.includes('interestPayments')) {
    //   results.interestPayments = await prisma.interestPayment.findMany({
    //     where: {
    //       userId: user.id,
    //       account: { name: { contains: query, mode: 'insensitive' } },
    //     },
    //     include: {
    //       account: { select: { id: true, name: true } },
    //     },
    //     orderBy: { date: 'desc' },
    //     take: limit,
    //   })
    // }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export type TimePeriod = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL'

type BalanceHistoryDataPoint = {
  date: string
  balance: number
}

type BalanceHistorySuccess = {
  success: true
  data: BalanceHistoryDataPoint[]
}

type BalanceHistoryError = {
  success: false
  error: string
}

export type BalanceHistoryResult = BalanceHistorySuccess | BalanceHistoryError

/**
 * Fetches balance history for an account over a specified time period
 * Returns data points suitable for charting
 *
 * @param accountId - The account ID to fetch history for
 * @param timePeriod - The time period to fetch ('1W', '1M', '3M', 'YTD', '1Y', 'ALL')
 */
export async function getAccountBalanceHistory(
  accountId: string,
  timePeriod: TimePeriod = '1M'
): Promise<BalanceHistoryResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to view balance history.',
      }
    }

    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: supabaseUser.email,
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found in database.',
      }
    }

    // Verify account exists and belongs to user
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    })

    if (!account) {
      return {
        success: false,
        error: 'Account not found.',
      }
    }

    if (account.userId !== user.id) {
      return {
        success: false,
        error: 'You do not have permission to view this account.',
      }
    }

    // Calculate date range based on time period
    const now = new Date()
    let startDate = new Date()

    switch (timePeriod) {
      case '1W':
        startDate.setDate(now.getDate() - 7)
        break
      case '1M':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3M':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'YTD':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'ALL':
        // Go back 10 years or to account creation date
        startDate = new Date(account.createdAt)
        break
    }

    // Fetch balance snapshots for the time period
    const snapshots = await prisma.accountBalanceSnapshot.findMany({
      where: {
        accountId,
        date: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: { date: 'asc' },
    })

    // If no snapshots exist, return current balance as a single data point
    if (snapshots.length === 0) {
      return {
        success: true,
        data: [
          {
            date: now.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            balance: Number(account.balance),
          },
        ],
      }
    }

    // Transform snapshots into chart data format
    const chartData: BalanceHistoryDataPoint[] = snapshots.map((snapshot) => ({
      date: snapshot.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      balance: Number(snapshot.balance),
    }))

    return {
      success: true,
      data: chartData,
    }
  } catch (error) {
    console.error('Error fetching account balance history:', error)
    return {
      success: false,
      error: 'Failed to fetch balance history. Please try again.',
    }
  }
}

/**
 * Fetches balance history for multiple accounts
 * Useful for overview charts showing total balances across accounts
 *
 * @param accountIds - Array of account IDs to fetch history for
 * @param timePeriod - The time period to fetch ('1W', '1M', '3M', 'YTD', '1Y', 'ALL')
 */
export async function getMultipleAccountsBalanceHistory(
  accountIds: string[],
  timePeriod: TimePeriod = '1M'
): Promise<BalanceHistoryResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to view balance history.',
      }
    }

    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: supabaseUser.email,
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found in database.',
      }
    }

    // Calculate date range based on time period
    const now = new Date()
    let startDate = new Date()

    switch (timePeriod) {
      case '1W':
        startDate.setDate(now.getDate() - 7)
        break
      case '1M':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3M':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'YTD':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'ALL':
        // Go back 10 years
        startDate.setFullYear(now.getFullYear() - 10)
        break
    }

    // Fetch all snapshots for all accounts
    const snapshots = await prisma.accountBalanceSnapshot.findMany({
      where: {
        accountId: { in: accountIds },
        userId: user.id,
        date: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: { date: 'asc' },
    })

    // Group snapshots by date and sum balances
    const dateBalanceMap = new Map<string, number>()

    snapshots.forEach((snapshot) => {
      const dateKey = snapshot.date.toISOString().split('T')[0] // YYYY-MM-DD
      const currentBalance = dateBalanceMap.get(dateKey) || 0
      dateBalanceMap.set(dateKey, currentBalance + Number(snapshot.balance))
    })

    // Convert to chart data format and sort by date
    const chartData: BalanceHistoryDataPoint[] = Array.from(dateBalanceMap.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([dateStr, balance]) => ({
        date: new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        balance,
      }))

    return {
      success: true,
      data: chartData,
    }
  } catch (error) {
    console.error('Error fetching multiple accounts balance history:', error)
    return {
      success: false,
      error: 'Failed to fetch balance history. Please try again.',
    }
  }
}

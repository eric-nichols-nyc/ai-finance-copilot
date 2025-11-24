'use server'

import { prisma } from '@/lib/prisma'

/**
 * Records a balance snapshot for an account at a specific date
 * This is used for tracking account balances over time for charts
 *
 * @param accountId - The account ID to record the snapshot for
 * @param balance - The balance to record (optional, uses current account balance if not provided)
 * @param date - The date to record the snapshot for (optional, uses current date if not provided)
 */
export async function recordBalanceSnapshot(
  accountId: string,
  balance?: number,
  date?: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the account if balance is not provided
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return { success: false, error: 'Account not found' }
    }

    const snapshotBalance = balance !== undefined ? balance : Number(account.balance)
    const snapshotDate = date || new Date()

    // Set time to start of day for consistency
    snapshotDate.setHours(0, 0, 0, 0)

    // Use upsert to avoid duplicates for the same account/date combination
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

    return { success: true }
  } catch (error) {
    console.error('Error recording balance snapshot:', error)
    return {
      success: false,
      error: 'Failed to record balance snapshot'
    }
  }
}

/**
 * Records balance snapshots for all accounts belonging to a user
 * Useful for daily batch jobs or initial data population
 *
 * @param userId - The user ID to record snapshots for
 * @param date - The date to record snapshots for (optional, uses current date if not provided)
 */
export async function recordAllBalanceSnapshots(
  userId: string,
  date?: Date
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const snapshotDate = date || new Date()
    snapshotDate.setHours(0, 0, 0, 0)

    // Get all accounts for the user
    const accounts = await prisma.account.findMany({
      where: { userId },
    })

    let successCount = 0

    // Record snapshot for each account
    for (const account of accounts) {
      const result = await recordBalanceSnapshot(
        account.id,
        Number(account.balance),
        snapshotDate
      )
      if (result.success) {
        successCount++
      }
    }

    return {
      success: true,
      count: successCount
    }
  } catch (error) {
    console.error('Error recording all balance snapshots:', error)
    return {
      success: false,
      count: 0,
      error: 'Failed to record balance snapshots'
    }
  }
}

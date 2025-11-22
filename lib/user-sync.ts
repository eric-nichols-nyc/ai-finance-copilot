import { prisma } from '@/lib/prisma'
import { User } from '@supabase/supabase-js'

/**
 * Syncs a Supabase user to the Prisma database
 * Creates the user if they don't exist, or updates if they do
 */
export async function syncUserToPrisma(supabaseUser: User) {
  try {
    const user = await prisma.user.upsert({
      where: {
        email: supabaseUser.email!,
      },
      update: {
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        updatedAt: new Date(),
      },
      create: {
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
      },
    })

    return user
  } catch (error) {
    console.error('Error syncing user to Prisma:', error)
    throw error
  }
}

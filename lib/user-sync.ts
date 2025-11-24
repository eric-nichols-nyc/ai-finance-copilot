import { prisma } from '@/lib/prisma'
import { User } from '@supabase/supabase-js'

/**
 * Syncs a Supabase user to the Prisma database
 * Creates the user if they don't exist, or updates if they do
 * IMPORTANT: Uses Supabase auth UUID as the primary key
 */
export async function syncUserToPrisma(supabaseUser: User) {
  try {
    const user = await prisma.user.upsert({
      where: {
        id: supabaseUser.id, // Use Supabase UUID as primary key
      },
      update: {
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        updatedAt: new Date(),
      },
      create: {
        id: supabaseUser.id, // Use Supabase UUID as primary key
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

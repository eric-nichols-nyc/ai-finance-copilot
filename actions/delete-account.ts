'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export async function deleteAccount() {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/error')
  }

  try {
    // Delete user from Prisma database (cascading deletes will handle related records)
    // Use deleteMany instead of delete to avoid error if user doesn't exist
    const result = await prisma.user.deleteMany({
      where: {
        email: user.email,
      },
    })

    if (result.count === 0) {
      console.log('User not found in Prisma database, skipping database deletion')
    } else {
      console.log(`Deleted user ${user.email} from Prisma database`)
    }

    // Note: Supabase user deletion from auth requires admin privileges
    // For now, we just delete from Prisma and sign out
    // In production, you'd want to set up a webhook or edge function to handle auth deletion
  } catch (error) {
    console.error('Error deleting user account:', error)
    // Continue to sign out even if database deletion fails
  }

  // Sign out the user
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

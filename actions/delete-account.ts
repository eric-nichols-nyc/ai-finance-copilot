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
    await prisma.user.delete({
      where: {
        email: user.email,
      },
    })

    // Note: Supabase user deletion from auth requires admin privileges
    // For now, we just delete from Prisma and sign out
    // In production, you'd want to set up a webhook or edge function to handle auth deletion
  } catch (error) {
    console.error('Error deleting user account:', error)
    redirect('/error')
  }

  // Sign out the user
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

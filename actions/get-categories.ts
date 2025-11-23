'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

type Category = {
  id: string
  name: string
  color: string | null
  icon: string | null
}

type GetCategoriesSuccess = {
  success: true
  categories: Category[]
}

type GetCategoriesError = {
  success: false
  error: string
}

export type GetCategoriesResult = GetCategoriesSuccess | GetCategoriesError

export async function getCategories(): Promise<GetCategoriesResult> {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()

    if (!supabaseUser?.email) {
      return {
        success: false,
        error: 'You must be signed in to view categories.',
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

    // Fetch categories for user
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error('Error fetching categories:', error)

    return {
      success: false,
      error: 'Failed to fetch categories.',
    }
  }
}

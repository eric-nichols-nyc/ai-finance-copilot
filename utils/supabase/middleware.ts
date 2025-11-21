import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl
  const isOnSignIn = url.pathname.startsWith('/sign-in')
  const isAuthenticated = !!user

  // Redirect unauthenticated users to sign-in page
  if (!isAuthenticated && !isOnSignIn) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Redirect authenticated users away from sign-in page
  if (isAuthenticated && isOnSignIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}
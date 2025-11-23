import { redirect } from 'next/navigation'

export default async function AuthenticatedRoot() {
  redirect('/dashboard')
}

import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/authResolver'
import type { User, UserRole } from '@/lib/types'

export async function resolveUser(): Promise<User> {
  const requestHeaders = await headers()
  let user = JSON.parse(requestHeaders.get('x-user') ?? '{}') as User

  if (!user.id) {
    const cookieStore = await cookies()
    const cookieValue = cookieStore.get('access_token')?.value
    user = (await getUser(cookieValue)) ?? ({} as User)
  }

  return user
}

export async function resolveUserWithRole(requiredRole: UserRole): Promise<User> {
  const user = await resolveUser()

  if (!user.id) {
    redirect(`/login/${requiredRole === 'family' ? 'family' : 'clinic'}`)
  }

  if (user.role !== requiredRole) {
    redirect(`/login/${requiredRole === 'family' ? 'family' : 'clinic'}`)
  }

  return user
}

import { redirect } from 'next/navigation'
import { authService } from '@/lib/authService'
import type { User, UserRole } from '@/lib/types'

export async function resolveUser(): Promise<User> {
  try {
    return await authService.me()
  } catch {
    return {} as User
  }
}

export async function resolveUserWithRole(requiredRole: UserRole): Promise<User> {
  let user: User

  try {
    user = await authService.me()
  } catch {
    redirect(`/login/${requiredRole === 'family' ? 'family' : 'clinic'}`)
  }

  if (user.role !== requiredRole) {
    redirect(`/login/${requiredRole === 'family' ? 'family' : 'clinic'}`)
  }

  return user
}

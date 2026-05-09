import type { UserRole } from '@/lib/types'

export function getDashboardUrl(role: UserRole): string {
  return role === 'family' ? '/family/dashboard' : '/clinic/dashboard'
}

export function getLoginUrl(role: UserRole | 'clinic' | 'family'): string {
  return `/${role === 'family' ? 'login/family' : 'login/clinic'}`
}

export function getLoginRedirectForPath(pathname: string): string {
  const isFamily = pathname.startsWith('/family')
  return isFamily ? '/login/family' : '/login/clinic'
}

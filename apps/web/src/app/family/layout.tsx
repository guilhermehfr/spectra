import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authService } from '@/lib/authService'

export default async function FamilyLayout({ children }: { children: ReactNode }) {
  const user = await authService.me().catch(() => null)

  if (!user) {
    redirect('/login/family')
  }

  if (user.role !== 'family') {
    redirect('/login/clinic')
  }

  return <>{children}</>
}
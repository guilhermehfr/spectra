import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { authService } from '@/lib/authService'
import { Layout } from '@/components/layout/clinic'

export default async function ClinicLayout({ children }: { children: ReactNode }) {
  const user = await authService.me().catch(() => null)

  if (!user) {
    redirect('/login/clinic')
  }

  if (user.role === 'family') {
    redirect('/login/family')
  }

  return <Layout user={user}>{children}</Layout>
}
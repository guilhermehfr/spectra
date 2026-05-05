import { ReactNode } from 'react'
import { ClinicSidebar } from './ClinicSidebar'
import { ClinicNavbar } from './ClinicNavbar'
import type { User } from '@/lib/types'

interface ClinicLayoutProps {
  children: ReactNode
  user?: User
}

export function ClinicLayout({ children, user }: ClinicLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <ClinicSidebar />
      <div className="flex-1 flex flex-col">
        <ClinicNavbar user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

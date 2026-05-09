import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import type { User } from '@/lib/types'

interface LayoutProps {
  children: ReactNode
  user?: User
}

export function Layout({ children, user }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-x-auto">{children}</main>
      </div>
    </div>
  )
}

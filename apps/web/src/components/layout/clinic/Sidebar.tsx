'use client'

import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar } from 'lucide-react'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'
import { SidebarFooter } from './SidebarFooter'
import type { SidebarNavItem } from './types'

const navItems: SidebarNavItem[] = [
  {
    label: 'Dashboard',
    href: '/clinic/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pacientes',
    href: '/clinic/patients',
    icon: Users,
  },
  {
    label: 'Sessões',
    href: '/clinic/sessions',
    icon: Calendar,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] h-screen flex flex-col bg-white border-r border-slate-200 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] flex-shrink-0">
      <SidebarHeader />
      <SidebarNav items={navItems} currentPath={pathname} />
      <SidebarFooter />
    </aside>
  )
}

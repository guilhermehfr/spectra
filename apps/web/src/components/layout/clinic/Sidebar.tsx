'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, Users, Calendar } from 'lucide-react'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'
import { SidebarFooter } from './SidebarFooter'
import type { SidebarNavItem } from './types'

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations('Clinic')

  const navItems: SidebarNavItem[] = [
    {
      label: t('dashboard'),
      href: '/clinic/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: t('patients'),
      href: '/clinic/patients',
      icon: Users,
    },
    {
      label: t('sessions'),
      href: '/clinic/sessions',
      icon: Calendar,
    },
  ]

  return (
    <aside className="w-[220px] h-screen flex flex-col bg-white border-r border-slate-200 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] flex-shrink-0">
      <SidebarHeader />
      <SidebarNav items={navItems} currentPath={pathname} />
      <SidebarFooter />
    </aside>
  )
}

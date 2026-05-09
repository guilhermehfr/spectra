'use client'

import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import type { SidebarNavItem } from './types'

interface SidebarNavProps {
  items: SidebarNavItem[]
  currentPath: string
}

export function SidebarNav({ items, currentPath }: SidebarNavProps) {
  const isActive = (href: string): boolean => {
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={twMerge(
              'flex items-center gap-4 px-2 py-2 rounded-lg transition-all duration-150',
              'text-sm font-manrope font-normal',
              active
                ? 'bg-gradient-blue-indigo-700 text-white shadow-[0px_2px_4px_-2px_rgba(191,219,254,0.5),0px_4px_6px_-1px_rgba(191,219,254,0.5)]'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

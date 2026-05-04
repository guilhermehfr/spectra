'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Scroll } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size: number; strokeWidth: number }>
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/family/dashboard',
    icon: Home,
  },
  {
    label: 'Evolutions',
    href: '/family/evolutions',
    icon: Scroll,
  },
]

export function FamilyNavbar() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const NavItem = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={twMerge(
          'flex flex-col md:flex-row items-center gap-1 md:gap-2 rounded-lg transition-colors duration-150',
          'px-4 py-2',
          active
            ? 'bg-blue-50 text-blue-600'
            : 'bg-transparent text-slate-400 hover:bg-blue-50 hover:text-blue-600'
        )}
      >
        <div className="text-current">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="font-manrope text-xs md:text-sm font-medium leading-normal">{item.label}</span>
      </Link>
    )
  }

  return (
    <nav
      className={twMerge(
        'fixed left-0 right-0 z-50',
        'flex items-center justify-center gap-8',
        'w-full h-16 bg-white',
        'border-b border-[var(--color-slate-200)]',
        'shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)]',
        // Mobile: bottom, Desktop: top
        'bottom-0 md:top-0',
        // Mobile: rounded top, Desktop: no rounded
        'rounded-t-3xl md:rounded-none'
      )}
    >
      {navItems.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}
    </nav>
  )
}
'use client'

import Link from 'next/link'
import { HelpCircle, LogOut } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { logoutAction } from '@/app/actions/auth'

export function ClinicSidebarFooter() {
  const handleLogout = async () => {
    await logoutAction()
  }

  const footerItemClass = twMerge(
    'flex items-center gap-4 px-2 py-2 rounded-lg transition-all duration-150',
    'text-sm font-manrope font-normal text-slate-600 hover:bg-slate-50'
  )

  return (
    <div className="px-2 py-4 border-t border-slate-200 flex flex-col gap-1">
      <Link
        href="https://docs.google.com/forms/d/e/1FAIpQLSeJneufWCzMTnmrrsQd1VqgXdVv1guRXb0pZ5xLl6Krir01RA/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className={footerItemClass}
      >
        <HelpCircle size={20} strokeWidth={1.5} />
        <span>Help</span>
      </Link>

      <button onClick={handleLogout} className={footerItemClass + ' w-full text-left'}>
        <LogOut size={20} strokeWidth={1.5} />
        <span>Logout</span>
      </button>
    </div>
  )
}

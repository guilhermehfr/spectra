'use client'

import Link from 'next/link'
import { User } from '@/lib/types'
import { ClinicSearchBar } from './ClinicSearchBar'
import { ClinicUserAvatar } from './ClinicUserAvatar'

interface ClinicNavbarProps {
  user?: User
}

export function ClinicNavbar({ user }: ClinicNavbarProps) {
  const handleSearch = (query: string) => {
    // TODO: Implement patient search functionality
    console.log('Search query:', query)
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center h-16 px-4 md:px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/clinic/dashboard"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Spectra
          </Link>
        </div>

        {/* Search Bar */}
        <ClinicSearchBar placeholder="Pesquisar pacientes..." onSearch={handleSearch} />

        {/* User Avatar */}
        <div className="flex-shrink-0">
          <ClinicUserAvatar user={user} />
        </div>
      </div>
    </nav>
  )
}

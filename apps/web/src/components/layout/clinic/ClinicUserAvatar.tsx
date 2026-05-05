'use client'

import { User } from '@/lib/types'

interface ClinicUserAvatarProps {
  user?: User
}

function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return '?'

  const firstInitial = firstName?.[0].toUpperCase() || ''
  const lastInitial = lastName?.[0].toUpperCase() || ''

  return (firstInitial + lastInitial).slice(0, 2)
}

export function ClinicUserAvatar({ user }: ClinicUserAvatarProps) {
  const initials = getInitials(user?.first_name, user?.last_name)

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border border-blue-200">
        <span className="text-sm font-medium text-blue-600">{initials}</span>
      </div>
    </div>
  )
}

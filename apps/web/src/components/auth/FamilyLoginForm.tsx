'use client'

import { BaseLoginForm } from './BaseLoginForm'
import { Users } from 'lucide-react'

export function FamilyLoginForm() {
  return (
    <BaseLoginForm
      subtitle="Portal familiar"
      startIcon={<Users size={25} className="text-blue-600" strokeWidth={2} />}
    />
  )
}

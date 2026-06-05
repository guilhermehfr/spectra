'use client'

import { BaseLoginForm } from './BaseLoginForm'
import { UserRound } from 'lucide-react'

export function ClinicLoginForm() {
  return (
    <BaseLoginForm
      subtitle="Portal de gerenciamento clínico"
      startIcon={<UserRound size={25} className="text-blue-600" strokeWidth={2} />}
    />
  )
}

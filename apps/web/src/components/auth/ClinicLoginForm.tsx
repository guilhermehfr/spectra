'use client'

import { useTranslations } from 'next-intl'
import { BaseLoginForm } from './BaseLoginForm'
import { UserRound } from 'lucide-react'

export function ClinicLoginForm() {
  const t = useTranslations('Login')
  return (
    <BaseLoginForm
      subtitle={t('clinicSubtitle')}
      startIcon={<UserRound size={25} className="text-blue-600" strokeWidth={2} />}
    />
  )
}

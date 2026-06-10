'use client'

import { useTranslations } from 'next-intl'
import { BaseLoginForm } from './BaseLoginForm'
import { Users } from 'lucide-react'

export function FamilyLoginForm() {
  const t = useTranslations('Login')
  return (
    <BaseLoginForm
      subtitle={t('familySubtitle')}
      startIcon={<Users size={25} className="text-blue-600" strokeWidth={2} />}
    />
  )
}

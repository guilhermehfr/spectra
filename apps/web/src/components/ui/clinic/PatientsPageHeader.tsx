'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/shared'
import { Plus } from 'lucide-react'

interface PatientsPageHeaderProps {
  onAddPatient?: () => void
}

export function PatientsPageHeader({ onAddPatient }: PatientsPageHeaderProps) {
  const t = useTranslations('Patients')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-manrope">{t('listTitle')}</h1>
        <p className="text-slate-500 font-manrope mt-1">{t('listDescription')}</p>
      </div>
      <Button
        onClick={onAddPatient}
        startIcon={<Plus className="w-5 h-5" />}
        className="bg-teal-500 hover:bg-teal-600"
      >
        {t('newPatient')}
      </Button>
    </div>
  )
}

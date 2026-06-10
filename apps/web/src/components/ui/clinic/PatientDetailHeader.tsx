'use client'

import { ChevronLeft, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface PatientDetailHeaderProps {
  patientName: string
  onEdit?: () => void
  onDelete?: () => void
  canDelete?: boolean
}

export function PatientDetailHeader({
  patientName,
  onEdit,
  onDelete,
  canDelete = true,
}: PatientDetailHeaderProps) {
  const t = useTranslations('Common')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clinic/patients"
          className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{patientName}</h1>
      </div>
      <div className="flex items-center gap-2 ml-13 sm:ml-0">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-100 rounded-lg hover:border-black hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          {t('edit')}
        </button>
        <button
          onClick={onDelete}
          disabled={!canDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          style={{
            color: canDelete ? '#dc2626' : '#9ca3af',
            borderColor: canDelete ? '#fee2e2' : '#e5e7eb',
          }}
          onMouseEnter={(e) => {
            if (canDelete) {
              e.currentTarget.style.backgroundColor = '#fef2f2'
              e.currentTarget.style.color = '#b91c1c'
            }
          }}
          onMouseLeave={(e) => {
            if (canDelete) {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = '#dc2626'
            }
          }}
        >
          <Trash2 className="w-4 h-4" />
          {t('delete')}
        </button>
      </div>
    </div>
  )
}

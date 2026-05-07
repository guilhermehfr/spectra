'use client'

import { ChevronLeft, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface ClinicPatientDetailHeaderProps {
  patientName: string
  onEdit?: () => void
  onDelete?: () => void
}

export function ClinicPatientDetailHeader({
  patientName,
  onEdit,
  onDelete,
}: ClinicPatientDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clinic/patients"
          className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{patientName}</h1>
      </div>
      <div className="flex items-center gap-2 ml-13 sm:ml-0">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>
    </div>
  )
}

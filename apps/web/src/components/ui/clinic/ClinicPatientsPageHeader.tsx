'use client'

import { Button } from '@/components/ui/shared'
import { Plus } from 'lucide-react'

interface ClinicPatientsPageHeaderProps {
  onAddPatient?: () => void
}

export function ClinicPatientsPageHeader({ onAddPatient }: ClinicPatientsPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-manrope">Lista de Pacientes</h1>
        <p className="text-slate-500 font-manrope mt-1">
          Organize e veja todos os pacientes registrados
        </p>
      </div>
      <Button
        onClick={onAddPatient}
        startIcon={<Plus className="w-5 h-5" />}
        className="bg-teal-500 hover:bg-teal-600"
      >
        Novo Paciente
      </Button>
    </div>
  )
}

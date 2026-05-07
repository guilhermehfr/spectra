'use client'

import { Container } from '@/components/ui/shared'
import { Pencil, Trash2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { Patient } from '@/lib/types'

interface ClinicPatientsTableProps {
  patients: Patient[]
  isLoading?: boolean
  onEdit?: (patient: Patient) => void
  onDelete?: (patient: Patient) => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function getAvatarColor(index: number): string {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600',
    'bg-green-100 text-green-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
  ]
  return colors[index % colors.length]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-36 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="py-4 px-4">
        <div className="h-8 w-8 bg-slate-100 rounded animate-pulse" />
      </td>
    </tr>
  )
}

export function ClinicPatientsTable({
  patients,
  isLoading = false,
  onEdit,
  onDelete,
}: ClinicPatientsTableProps) {
  return (
    <Container className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                PACIENTE
              </th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                RESPONSAVEL
              </th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                DATA DE NASCIMENTO
              </th>
              <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 px-4 text-center text-slate-500">
                  Nenhum paciente encontrado
                </td>
              </tr>
            ) : (
              patients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={twMerge(
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                          getAvatarColor(index)
                        )}
                      >
                        {getInitials(patient.name)}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-600">{patient.guardian_name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-600">{formatDate(patient.birth_date)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(patient)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(patient)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Container>
  )
}

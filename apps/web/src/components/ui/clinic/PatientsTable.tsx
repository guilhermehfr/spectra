'use client'

import { Container } from '@/components/ui/shared'
import { Pencil, Trash2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { Patient } from '@/lib/types'
import { formatDate } from '@/lib/utils/dateUtils'

interface PatientsTableProps {
  patients: Patient[]
  isLoading?: boolean
  onView?: (patient: Patient) => void
  onEdit?: (patient: Patient) => void
  onDelete?: (patient: Patient) => void
  canDelete?: boolean
}

const AVATAR_COLORS = [
  'bg-[#3B82F6]',
  'bg-[#6366F1]',
  'bg-[#22C55E]',
  'bg-[#F59E0B]',
  'bg-[#EF4444]',
  'bg-[#64748B]',
]

function getAvatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-32" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-24" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-20" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
      </td>
    </tr>
  )
}

export function PatientsTable({
  patients,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  canDelete = true,
}: PatientsTableProps) {
  return (
    <Container className="overflow-x-auto p-0">
      <table className="w-full min-w-[600px]">
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
            patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-slate-100 hover:bg-slate-100 transition-colors"
              >
                <td className="py-4 px-4">
                  <button
                    onClick={() => onView?.(patient)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div
                      className={twMerge(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white',
                        getAvatarColor(patient.id)
                      )}
                    >
                      {getInitials(patient.name)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{patient.name}</span>
                  </button>
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
                      className="p-2 rounded-lg cursor-pointer hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(patient)}
                      disabled={!canDelete}
                      className="p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 text-slate-500 hover:text-red-600"
                      title={canDelete ? 'Excluir' : 'Apenas administradores podem excluir'}
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
    </Container>
  )
}

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
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-slate-600',
  'bg-zinc-600',
  'bg-stone-600',
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
                      className="p-2 rounded-lg cursor-pointer hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
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
    </Container>
  )
}

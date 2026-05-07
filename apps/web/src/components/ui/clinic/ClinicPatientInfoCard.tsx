'use client'

import { Mail } from 'lucide-react'
import type { Patient } from '@/lib/types'

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const avatarColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-indigo-500',
]

function getAvatarColor(id: number): string {
  return avatarColors[id % avatarColors.length]
}

interface ClinicPatientInfoCardProps {
  patient: Patient
}

export function ClinicPatientInfoCard({ patient }: ClinicPatientInfoCardProps) {
  const initials = getInitials(patient.name)
  const age = calculateAge(patient.birth_date)
  const avatarColor = getAvatarColor(patient.id)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          <div
            className={`w-16 h-16 ${avatarColor} rounded-full flex items-center justify-center text-white text-xl font-semibold`}
          >
            {initials}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Data de Nascimento
            </label>
            <p className="text-sm md:text-base text-slate-700 font-medium">
              {formatDate(patient.birth_date)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Idade
            </label>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-slate-100 text-slate-700">
              {age} {age === 1 ? 'ano' : 'anos'}
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Responsável
            </label>
            <p className="text-sm md:text-base text-slate-700 font-medium mb-1">
              {patient.guardian_name}
            </p>
            <a
              href={`mailto:${patient.guardian_email}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Mail className="w-4 h-4" />
              {patient.guardian_email}
            </a>
          </div>

          {patient.notes && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Observações
              </label>
              <p className="text-sm md:text-base text-slate-600">{patient.notes}</p>
            </div>
          )}

          <div className="sm:col-span-2 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Cadastrado em {formatDate(patient.created_at)}
              {patient.updated_at !== patient.created_at && (
                <> · Última atualização em {formatDate(patient.updated_at)}</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

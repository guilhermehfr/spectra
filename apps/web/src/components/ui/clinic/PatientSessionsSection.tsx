'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { Session, SessionStatus } from '@/lib/types'

function formatDateTime(dateString: string): string {
  const [datePart, timePart] = dateString.split('T')
  if (timePart) {
    const [year, month, day] = datePart.split('-')
    const [hour, minute] = timePart.split(':')
    return `${day}/${month}/${year} às ${hour}:${minute}`
  }
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  scheduled: {
    label: 'Agendada',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
}

interface SessionCardProps {
  session: Session
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
}

function SessionCard({ session, onEdit, onDelete }: SessionCardProps) {
  const status = statusConfig[session.status]

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">{formatDateTime(session.date_time)}</p>
          <p className="text-sm text-slate-600">{session.therapist_name}</p>
        </div>
        <span
          className={twMerge('px-2.5 py-1 rounded-md text-xs font-medium border', status.className)}
        >
          {status.label}
        </span>
      </div>
      {session.notes && <p className="text-sm text-slate-600">{session.notes}</p>}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onEdit(session)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={() => onDelete(session)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Excluir
        </button>
      </div>
    </div>
  )
}

interface SessionRowProps {
  session: Session
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
}

function SessionRow({ session, onEdit, onDelete }: SessionRowProps) {
  const status = statusConfig[session.status]

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4 text-sm text-slate-700">{formatDateTime(session.date_time)}</td>
      <td className="py-3 px-4 text-sm text-slate-700">{session.therapist_name}</td>
      <td className="py-3 px-4">
        <span
          className={twMerge('px-2.5 py-1 rounded-md text-xs font-medium border', status.className)}
        >
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">{session.notes || '-'}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(session)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(session)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

interface PatientSessionsSectionProps {
  sessions: Session[]
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onAdd: () => void
}

export function PatientSessionsSection({
  sessions,
  onEdit,
  onDelete,
  onAdd,
}: PatientSessionsSectionProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
  )

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">Sessões</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Sessão
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="px-4 md:px-6 py-12 text-center">
          <p className="text-sm text-slate-500">Nenhuma sessão registrada para este paciente.</p>
        </div>
      ) : (
        <>
          <div className="md:hidden p-4 space-y-3">
            {sortedSessions.map((session) => (
              <SessionCard key={session.id} session={session} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Data / Horário
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Terapeuta
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Observações
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

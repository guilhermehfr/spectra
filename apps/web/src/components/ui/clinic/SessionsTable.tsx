'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Pencil, Trash2, Eye } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { Session } from '@/lib/types'
import { formatDateTimeISO, getSessionStatusDisplay } from '@/lib/utils'

interface SessionsTableProps {
  sessions: Session[]
  isLoading?: boolean
  onView?: (session: Session) => void
  onEdit?: (session: Session) => void
  onDelete?: (session: Session) => void
}

interface SessionCardProps {
  session: Session
  onView: (session: Session) => void
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  t: (key: string) => string
}

function SessionCard({ session, onView, onEdit, onDelete, t }: SessionCardProps) {
  const tss = useTranslations('SessionStatus')
  const locale = useLocale()
  const status = getSessionStatusDisplay(session.status, tss)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {formatDateTimeISO(session.date_time, locale)}
          </p>
          <p className="text-sm text-slate-600">{session.patient_name}</p>
          <p className="text-xs text-slate-500">{session.therapist_name}</p>
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
          onClick={() => onView(session)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          {t('view')}
        </button>
        <button
          onClick={() => onEdit(session)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          {t('edit')}
        </button>
        <button
          onClick={() => onDelete(session)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {t('delete')}
        </button>
      </div>
    </div>
  )
}

interface SessionRowProps {
  session: Session
  onView: (session: Session) => void
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  t: (key: string) => string
}

function SessionRow({ session, onView, onEdit, onDelete, t }: SessionRowProps) {
  const tss = useTranslations('SessionStatus')
  const locale = useLocale()
  const status = getSessionStatusDisplay(session.status, tss)

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4 text-sm text-slate-700">
        {formatDateTimeISO(session.date_time, locale)}
      </td>
      <td className="py-3 px-4 text-sm text-slate-700">{session.patient_name}</td>
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
            onClick={() => onView(session)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title={t('view')}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(session)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title={t('edit')}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(session)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function SessionsTable({
  sessions,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: SessionsTableProps) {
  const t = useTranslations('SessionsTable')

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-500">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {sessions.length === 0 ? (
        <div className="px-4 md:px-6 py-12 text-center">
          <p className="text-sm text-slate-500">{t('empty')}</p>
        </div>
      ) : (
        <>
          <div className="md:hidden p-4 space-y-3">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onView={onView!}
                onEdit={onEdit!}
                onDelete={onDelete!}
                t={t}
              />
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('dateTime')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('patient')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('therapist')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('status')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('notes')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onView={onView!}
                    onEdit={onEdit!}
                    onDelete={onDelete!}
                    t={t}
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

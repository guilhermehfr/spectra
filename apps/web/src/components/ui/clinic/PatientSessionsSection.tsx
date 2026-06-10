'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { twMerge } from 'tailwind-merge'
import type { Session, User } from '@/lib/types'
import {
  formatDateTimeISO,
  getSessionStatusDisplay,
  canEditSession,
  canDeleteSession,
} from '@/lib/utils'

interface SessionCardProps {
  session: Session
  currentUser: User
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
}

function SessionCard({ session, currentUser, onEdit, onDelete }: SessionCardProps) {
  const t = useTranslations('PatientDetail')
  const commonT = useTranslations('Common')
  const tss = useTranslations('SessionStatus')
  const locale = useLocale()
  const status = getSessionStatusDisplay(session.status, tss)
  const canEdit = canEditSession(session, currentUser)
  const canDelete = canDeleteSession(session, currentUser)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {formatDateTimeISO(session.date_time, locale)}
          </p>
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
          disabled={!canEdit}
          title={!canEdit ? t('sessionEditNotPermitted') : undefined}
          className={twMerge(
            'flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            canEdit
              ? 'text-slate-600 hover:text-slate-700 hover:bg-slate-50 cursor-pointer'
              : 'text-slate-300 cursor-not-allowed'
          )}
        >
          <Pencil className="w-3.5 h-3.5" />
          {commonT('edit')}
        </button>
        <button
          onClick={() => onDelete(session)}
          disabled={!canDelete}
          title={!canDelete ? t('sessionDeleteNotPermitted') : undefined}
          className={twMerge(
            'flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            canDelete
              ? 'text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer'
              : 'text-slate-300 cursor-not-allowed'
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
          {commonT('delete')}
        </button>
      </div>
    </div>
  )
}

interface SessionRowProps {
  session: Session
  currentUser: User
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
}

function SessionRow({ session, currentUser, onEdit, onDelete }: SessionRowProps) {
  const t = useTranslations('PatientDetail')
  const commonT = useTranslations('Common')
  const tss = useTranslations('SessionStatus')
  const locale = useLocale()
  const status = getSessionStatusDisplay(session.status, tss)
  const canEdit = canEditSession(session, currentUser)
  const canDelete = canDeleteSession(session, currentUser)

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4 text-sm text-slate-700">
        {formatDateTimeISO(session.date_time, locale)}
      </td>
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
            disabled={!canEdit}
            title={!canEdit ? t('sessionEditNotPermitted') : commonT('edit')}
            className={twMerge(
              'p-1.5 rounded-md transition-colors',
              canEdit
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-200 cursor-not-allowed'
            )}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(session)}
            disabled={!canDelete}
            title={!canDelete ? t('sessionDeleteNotPermitted') : commonT('delete')}
            className={twMerge(
              'p-1.5 rounded-md transition-colors',
              canDelete
                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                : 'text-slate-200 cursor-not-allowed'
            )}
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
  currentUser: User
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onAdd: () => void
}

export function PatientSessionsSection({
  sessions,
  currentUser,
  onEdit,
  onDelete,
  onAdd,
}: PatientSessionsSectionProps) {
  const t = useTranslations('PatientDetail')

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
  )

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">{t('sessionsTitle')}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('newSession')}
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="px-4 md:px-6 py-12 text-center">
          <p className="text-sm text-slate-500">{t('noSessions')}</p>
        </div>
      ) : (
        <>
          <div className="md:hidden p-4 space-y-3">
            {sortedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                currentUser={currentUser}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('dateTimeHeader')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('therapistHeader')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('statusHeader')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('notesHeader')}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-slate-500">
                    {t('actionsHeader')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    currentUser={currentUser}
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

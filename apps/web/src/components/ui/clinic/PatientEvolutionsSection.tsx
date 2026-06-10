'use client'

import { Check, Lock, Pencil, Plus, Share2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { Evolution, Session, User } from '@/lib/types'
import { formatDate } from '@/lib/utils/dateUtils'
import { canEditEvolution, canReleaseEvolution } from '@/lib/utils/permissionUtils'

interface EvolutionFieldProps {
  label: string
  value: string
}

function EvolutionField({ label, value }: EvolutionFieldProps) {
  if (!value) return null
  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">{label}</label>
      <p className="text-sm text-slate-700 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

interface EvolutionCardProps {
  evolution: Evolution
  sessions: Session[]
  currentUser: User
  onEdit: (evolution: Evolution) => void
  onRelease: (evolution: Evolution) => void
  isReleasing?: boolean
}

function EvolutionCard({
  evolution,
  sessions,
  currentUser,
  onEdit,
  onRelease,
  isReleasing,
}: EvolutionCardProps) {
  const t = useTranslations('PatientDetail')
  const commonT = useTranslations('Common')
  const locale = useLocale()
  const isReleased = evolution.released_to_family
  const session = sessions.find((s) => s.id === evolution.session)
  const sessionTherapistId = session?.therapist ?? 0
  const canEdit = canEditEvolution(evolution, currentUser, sessionTherapistId)
  const canRelease = canReleaseEvolution(evolution, currentUser, sessionTherapistId)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {evolution.session_date
              ? formatDate(evolution.session_date, locale)
              : formatDate(evolution.created_at, locale)}
          </p>
          <p className="text-sm text-slate-600">
            {t('therapistLabel', { name: evolution.therapist_name })}
          </p>
          {evolution.author_name && (
            <p className="text-xs text-slate-500">
              {t('registeredBy', { name: evolution.author_name })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              isReleased
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isReleased ? (
              <>
                <Check className="w-3 h-3" />
                {t('shared')}
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                {t('notShared')}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <EvolutionField label={t('objectiveLabel')} value={evolution.objective} />
        <EvolutionField label={t('activitiesLabel')} value={evolution.activities} />
        <EvolutionField label={t('behaviorLabel')} value={evolution.behavior} />
        <EvolutionField label={t('progressLabel')} value={evolution.progress} />
        <EvolutionField label={t('nextStepsLabel')} value={evolution.next_steps} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => onEdit(evolution)}
          disabled={!canEdit}
          title={!canEdit ? t('evolutionEditNotPermitted') : undefined}
          className={
            canEdit
              ? 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer'
              : 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 rounded-md transition-colors cursor-not-allowed'
          }
        >
          <Pencil className="w-3.5 h-3.5" />
          {commonT('edit')}
        </button>
        {!isReleased && (
          <button
            onClick={() => onRelease(evolution)}
            disabled={isReleasing || !canRelease}
            title={!canRelease ? t('evolutionShareNotPermitted') : undefined}
            className={
              canRelease && !isReleasing
                ? 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-md transition-colors cursor-pointer'
                : 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-300 rounded-md transition-colors cursor-not-allowed'
            }
          >
            <Share2 className="w-3.5 h-3.5" />
            {t('shareWithFamily')}
          </button>
        )}
      </div>
    </div>
  )
}

interface PatientEvolutionsSectionProps {
  evolutions: Evolution[]
  sessions: Session[]
  currentUser: User
  onEdit: (evolution: Evolution) => void
  onRelease: (evolution: Evolution) => void
  onAdd: () => void
  isReleasing?: boolean
}

export function PatientEvolutionsSection({
  evolutions,
  sessions,
  currentUser,
  onEdit,
  onRelease,
  onAdd,
  isReleasing = false,
}: PatientEvolutionsSectionProps) {
  const t = useTranslations('PatientDetail')

  const sortedEvolutions = [...evolutions].sort(
    (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
  )

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">{t('evolutionsTitle')}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[linear-gradient(90deg,#2563EB,#4648D4)] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('newEvolution')}
        </button>
      </div>

      {evolutions.length === 0 ? (
        <div className="px-4 md:px-6 py-12 text-center">
          <p className="text-sm text-slate-500">{t('noEvolutions')}</p>
        </div>
      ) : (
        <div className="p-4 md:p-6 space-y-4">
          {sortedEvolutions.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              sessions={sessions}
              currentUser={currentUser}
              onEdit={onEdit}
              onRelease={onRelease}
              isReleasing={isReleasing}
            />
          ))}
        </div>
      )}
    </div>
  )
}

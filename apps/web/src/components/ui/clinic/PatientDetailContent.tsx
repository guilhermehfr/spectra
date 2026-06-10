'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'react-toastify'
import type { Patient, Session, Evolution, User } from '@/lib/types'
import { deleteSessionAction } from '@/app/actions/session'
import { deletePatientAction } from '@/app/actions/patient'
import { releaseEvolutionAction } from '@/app/actions/evolution'

import { PatientDetailHeader } from './PatientDetailHeader'
import { PatientInfoCard } from './PatientInfoCard'
import { PatientSessionsSection } from './PatientSessionsSection'
import { PatientEvolutionsSection } from './PatientEvolutionsSection'

interface PatientDetailContentProps {
  patient: Patient
  sessions: Session[]
  evolutions: Evolution[]
  currentUser: User
}

export function PatientDetailContent({
  patient,
  sessions,
  evolutions,
  currentUser,
}: PatientDetailContentProps) {
  const router = useRouter()
  const t = useTranslations('PatientDetail')
  const commonT = useTranslations('Common')
  const locale = useLocale()
  const [showDeleteConfirmPatient, setShowDeleteConfirmPatient] = useState(false)
  const [showDeleteConfirmSession, setShowDeleteConfirmSession] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [isReleasing, setIsReleasing] = useState(false)
  const [showSessionSelect, setShowSessionSelect] = useState(false)
  const [availableSessions, setAvailableSessions] = useState<Session[]>([])

  const handleEditPatient = () => {
    router.push(`/clinic/patients/${patient.id}/edit`)
  }

  const handleDeletePatient = () => {
    setShowDeleteConfirmPatient(true)
  }

  const handleConfirmDelete = async (data: string, sessionId?: number) => {
    try {
      if (data === 'patient') {
        await deletePatientAction(patient.id)
      } else if (data === 'session' && sessionId) {
        await deleteSessionAction(sessionId, patient.id)
      }
    } catch (error) {
      if (data === 'session') {
        console.error('Failed to delete session:', error)
      }
    } finally {
      router.refresh()
      if (data === 'patient') {
        router.replace('/clinic/patients')
      }
    }
  }

  const handleAddSession = () => {
    router.push(`/clinic/sessions/new?patient=${patient.id}`)
  }

  const handleEditSession = (session: Session) => {
    router.push(`/clinic/sessions/${session.id}/edit`)
  }

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session)
    setShowDeleteConfirmSession(true)
  }

  const handleAddEvolution = () => {
    const completedSessions = sessions.filter((s) => s.status === 'completed')

    const evolutionSessionIds = new Set(evolutions.map((e) => e.session))
    const availableSessions = completedSessions.filter((s) => !evolutionSessionIds.has(s.id))

    if (availableSessions.length === 0) {
      if (completedSessions.length === 0) {
        toast.error(t('needCompletedSession'))
      } else {
        toast.error(t('allSessionsHaveEvolution'))
      }
      return
    }

    if (availableSessions.length === 1) {
      router.push(`/clinic/sessions/${availableSessions[0].id}/evolution/new`)
    } else {
      setAvailableSessions(availableSessions)
      setShowSessionSelect(true)
    }
  }

  const handleSelectSessionForEvolution = (sessionId: number) => {
    setShowSessionSelect(false)
    router.push(`/clinic/sessions/${sessionId}/evolution/new`)
  }

  const handleEditEvolution = (evolution: Evolution) => {
    router.push(`/clinic/evolutions/${evolution.id}/edit`)
  }

  const handleReleaseEvolution = async (evolution: Evolution) => {
    setIsReleasing(true)
    const result = await releaseEvolutionAction(evolution.id)
    setIsReleasing(false)

    if (result.success) {
      toast.success(t('evolutionReleased'))
      router.refresh()
    } else {
      toast.error(result.error || t('releaseEvolutionFailed'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PatientDetailHeader
        patientName={patient.name}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        canDelete={currentUser.role === 'admin'}
      />

      <PatientInfoCard patient={patient} />

      <PatientSessionsSection
        sessions={sessions}
        currentUser={currentUser}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onAdd={handleAddSession}
      />

      <PatientEvolutionsSection
        evolutions={evolutions}
        sessions={sessions}
        currentUser={currentUser}
        onEdit={handleEditEvolution}
        onRelease={handleReleaseEvolution}
        onAdd={handleAddEvolution}
        isReleasing={isReleasing}
      />

      {showDeleteConfirmPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('deletePatientTitle')}</h3>
            <p className="text-sm text-slate-600 mb-6">{t('deletePatientDescription')}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirmPatient(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {commonT('cancel')}
              </button>
              <button
                onClick={() => handleConfirmDelete('patient')}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {commonT('deleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('deleteSessionTitle')}</h3>
            <p className="text-sm text-slate-600 mb-6">{t('deleteSessionDescription')}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirmSession(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {commonT('cancel')}
              </button>
              <button
                onClick={() => {
                  if (sessionToDelete) {
                    handleConfirmDelete('session', sessionToDelete.id)
                    setShowDeleteConfirmSession(false)
                    setSessionToDelete(null)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {commonT('deleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSessionSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('selectSessionTitle')}</h3>
            <p className="text-sm text-slate-600 mb-4">{t('selectSessionDescription')}</p>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {availableSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSessionForEvolution(session.id)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(session.date_time).toLocaleDateString(locale, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t('therapistLabel', { name: session.therapist_name })}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSessionSelect(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {commonT('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

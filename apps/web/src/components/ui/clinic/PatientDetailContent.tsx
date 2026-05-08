'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Patient, Session, Evolution } from '@/lib/types'
import { deleteSessionAction } from '@/app/actions/session'
import { deletePatientAction } from '@/app/actions/patient'

import { PatientDetailHeader } from './PatientDetailHeader'
import { PatientInfoCard } from './PatientInfoCard'
import { PatientSessionsSection } from './PatientSessionsSection'
import { PatientEvolutionsSection } from './PatientEvolutionsSection'

interface PatientDetailContentProps {
  patient: Patient
  sessions: Session[]
  evolutions: Evolution[]
}

export function PatientDetailContent({ patient, sessions, evolutions }: PatientDetailContentProps) {
  const router = useRouter()
  const [showDeleteConfirmPatient, setShowDeleteConfirmPatient] = useState(false)
  const [showDeleteConfirmSession, setShowDeleteConfirmSession] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)

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
      } else if (data === 'session') {
        console.log('Delete session confirmed')
      }
    }
  }

  const handleAddSession = () => {
    router.push(`/clinic/sessions/new?patient=${patient.id}`)
  }

  const handleEditSession = (session: Session) => {
    router.push(`/clinic/sessions/${session.id}`)
  }

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session)
    setShowDeleteConfirmSession(true)
  }

  const handleAddEvolution = () => {
    router.push('/clinic/evolutions/new')
  }

  const handleEditEvolution = (evolution: Evolution) => {
    router.push(`/clinic/evolutions/${evolution.id}`)
  }

  const handleReleaseEvolution = (evolution: Evolution) => {
    console.log('Release evolution to family:', evolution.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <PatientDetailHeader
        patientName={patient.name}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

      <PatientInfoCard patient={patient} />

      <PatientSessionsSection
        sessions={sessions}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onAdd={handleAddSession}
      />

      <PatientEvolutionsSection
        evolutions={evolutions}
        onEdit={handleEditEvolution}
        onRelease={handleReleaseEvolution}
        onAdd={handleAddEvolution}
      />

      {showDeleteConfirmPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Deletar paciente?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta ação não pode ser desfeita. Todas as sessões e evoluções associadas serão
              removidas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirmPatient(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmDelete('patient')}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Deletar sessão?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta ação não pode ser desfeita. A sessão será removida.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirmSession(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
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
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

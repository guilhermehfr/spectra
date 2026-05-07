'use client'

import { useState } from 'react'
import { ClinicPatientDetailHeader } from './ClinicPatientDetailHeader'
import { ClinicPatientInfoCard } from './ClinicPatientInfoCard'
import { ClinicPatientSessionsSection } from './ClinicPatientSessionsSection'
import { ClinicPatientEvolutionsSection } from './ClinicPatientEvolutionsSection'
import type { Patient, Session, Evolution } from '@/lib/types'

interface ClinicPatientDetailContentProps {
  patient: Patient
  sessions: Session[]
  evolutions: Evolution[]
}

export function ClinicPatientDetailContent({
  patient,
  sessions,
  evolutions,
}: ClinicPatientDetailContentProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleEditPatient = () => {
    console.log('Edit patient:', patient.id)
  }

  const handleDeletePatient = () => {
    console.log('Delete patient:', patient.id)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    console.log('Confirm delete patient:', patient.id)
    setShowDeleteConfirm(false)
  }

  const handleAddSession = () => {
    console.log('Add session for patient:', patient.id)
  }

  const handleEditSession = (session: Session) => {
    console.log('Edit session:', session.id)
  }

  const handleDeleteSession = (session: Session) => {
    console.log('Delete session:', session.id)
  }

  const handleAddEvolution = () => {
    console.log('Add evolution for patient:', patient.id)
  }

  const handleEditEvolution = (evolution: Evolution) => {
    console.log('Edit evolution:', evolution.id)
  }

  const handleReleaseEvolution = (evolution: Evolution) => {
    console.log('Release evolution to family:', evolution.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <ClinicPatientDetailHeader
        patientName={patient.name}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

      <ClinicPatientInfoCard patient={patient} />

      <ClinicPatientSessionsSection
        sessions={sessions}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onAdd={handleAddSession}
      />

      <ClinicPatientEvolutionsSection
        evolutions={evolutions}
        onEdit={handleEditEvolution}
        onRelease={handleReleaseEvolution}
        onAdd={handleAddEvolution}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Deletar paciente?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Esta ação não pode ser desfeita. Todas as sessões e evoluções associadas serão
              removidas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
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

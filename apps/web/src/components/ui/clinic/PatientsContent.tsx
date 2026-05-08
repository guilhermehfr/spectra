'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PatientsTable } from './PatientsTable'
import { PatientsPageHeader } from './PatientsPageHeader'
import { PaginationNav } from './PaginationNav'
import { deletePatientAction } from '@/app/actions/patient'
import type { Patient } from '@/lib/types'

interface PatientsContentProps {
  initialPatients: Patient[]
  totalCount: number
  isLoading?: boolean
}

const ITEMS_PER_PAGE = 10

export function PatientsContent({
  initialPatients,
  totalCount,
  isLoading = false,
}: PatientsContentProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddPatient = () => {
    router.push('/clinic/patients/new')
  }

  const handleViewPatient = (patient: Patient) => {
    router.push(`/clinic/patients/${patient.id}`)
  }

  const handleEditPatient = (patient: Patient) => {
    router.push(`/clinic/patients/${patient.id}/edit`)
  }

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient)
  }

  const confirmDelete = async () => {
    if (!patientToDelete) return
    try {
      await deletePatientAction(patientToDelete.id)
    } catch (error) {
      console.error('Failed to delete patient:', error)
    } finally {
      router.refresh()
      router.replace('/clinic/patients')
      setPatientToDelete(null)
    }
  }

  const cancelDelete = () => {
    setPatientToDelete(null)
  }

  // Calculate pagination indices
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE
  const endItem = Math.min(startItem + ITEMS_PER_PAGE, totalCount)
  const currentPatients = initialPatients.slice(startItem, endItem)

  return (
    <div className="flex flex-col gap-6">
      <PatientsPageHeader onAddPatient={handleAddPatient} />

      <PatientsTable
        patients={currentPatients}
        isLoading={isLoading}
        onView={handleViewPatient}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

      {!isLoading && totalCount > 0 && (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Excluir paciente?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Tem certeza que deseja excluir {patientToDelete.name}? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

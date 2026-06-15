'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PatientsTable } from './PatientsTable'
import { PatientsPageHeader } from './PatientsPageHeader'
import { PaginationNav } from './PaginationNav'
import { deletePatientAction } from '@/app/actions/patient'
import type { Patient, User } from '@/lib/types'

interface PatientsContentProps {
  initialPatients: Patient[]
  totalCount: number
  isLoading?: boolean
  searchQuery?: string
  currentUser?: User
}

const ITEMS_PER_PAGE = 10

export function PatientsContent({
  initialPatients,
  totalCount,
  isLoading = false,
  searchQuery,
  currentUser,
}: PatientsContentProps) {
  const router = useRouter()
  const t = useTranslations('Patients')
  const tc = useTranslations('Common')
  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(1)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)

  const filteredPatients = searchQuery
    ? initialPatients.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : initialPatients
  const filteredCount = searchQuery ? filteredPatients.length : totalCount
  const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddPatient = () => {
    router.push('/clinic/patients/new')
  }

  const handleViewPatient = (patient: Patient) => {
    startTransition(() => {
      router.push(`/clinic/patients/${patient.id}`)
    })
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

  // Calculate pagination indices
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE
  const endItem = Math.min(startItem + ITEMS_PER_PAGE, filteredPatients.length)
  const currentPatients = filteredPatients.slice(startItem, endItem)

  return (
    <div className="flex flex-col gap-6">
      <PatientsPageHeader onAddPatient={handleAddPatient} />

      <PatientsTable
        patients={currentPatients}
        isLoading={isLoading}
        onView={handleViewPatient}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        canDelete={currentUser?.role === 'admin'}
      />

      {!isLoading && filteredCount > 0 && (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('deleteConfirmTitle')}</h3>
            <p className="text-sm text-slate-600 mb-6">
              {t('deleteConfirmMessage', { name: patientToDelete.name })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {tc('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white/80 px-6 py-4 shadow-lg">
            <svg
              className="size-8 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

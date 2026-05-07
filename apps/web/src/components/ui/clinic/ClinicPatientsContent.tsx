'use client'

import { useState } from 'react'
import { ClinicPatientsTable } from './ClinicPatientsTable'
import { ClinicPatientsPageHeader } from './ClinicPatientsPageHeader'
import { ClinicPaginationNav } from './ClinicPaginationNav'
import type { Patient } from '@/lib/types'

interface ClinicPatientsContentProps {
  initialPatients: Patient[]
  totalCount: number
  isLoading?: boolean
}

const ITEMS_PER_PAGE = 10

export function ClinicPatientsContent({
  initialPatients,
  totalCount,
  isLoading = false,
}: ClinicPatientsContentProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddPatient = () => {
    console.log('Add new patient')
  }

  const handleEditPatient = (patient: Patient) => {
    console.log('Edit patient:', patient.id)
  }

  const handleDeletePatient = (patient: Patient) => {
    console.log('Delete patient:', patient.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <ClinicPatientsPageHeader onAddPatient={handleAddPatient} />

      <ClinicPatientsTable
        patients={initialPatients}
        isLoading={isLoading}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

      {!isLoading && totalCount > 0 && (
        <ClinicPaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

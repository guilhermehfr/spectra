'use server'

import { revalidatePath } from 'next/cache'
import { createPatient, updatePatient, deletePatient } from '@/lib/api/clinic'
import { revalidatePatients, revalidatePatient, revalidateDashboard } from '@/lib/api/http'
import { getServerT } from '@/lib/utils/translationUtils'
import type { CreatePatientInput, UpdatePatientInput } from '@/lib/types'

export interface PatientFormState {
  success: boolean
  error?: string
  errors?: Record<string, string>
}

export async function createPatientAction(
  _: PatientFormState,
  formData: FormData
): Promise<PatientFormState> {
  const t = await getServerT()
  const name = formData.get('name')?.toString().trim() || ''
  const birth_date = formData.get('birth_date')?.toString().trim() || ''
  const guardian_name = formData.get('guardian_name')?.toString().trim() || ''
  const guardian_email = formData.get('guardian_email')?.toString().trim() || ''
  const notes = formData.get('notes')?.toString().trim() || ''

  const errors: Record<string, string> = {}

  if (!name) {
    errors.name = t('Actions.nameRequired')
  }
  if (!birth_date) {
    errors.birth_date = t('Actions.birthDateRequired')
  }
  if (!guardian_name) {
    errors.guardian_name = t('Actions.guardianNameRequired')
  }
  if (!guardian_email) {
    errors.guardian_email = t('Actions.guardianEmailRequired')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guardian_email)) {
      errors.guardian_email = t('Actions.invalidEmail')
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const patientData: CreatePatientInput = {
      name,
      birth_date,
      guardian_name,
      guardian_email,
      notes,
    }

    const newPatient = await createPatient(patientData)

    revalidatePath('/clinic/patients')
    revalidatePath('/clinic/dashboard')
    revalidatePatients()
    if (newPatient?.id) {
      revalidatePatient(newPatient.id)
    }
    revalidateDashboard()
    return { success: true }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Failed to create patient:', error)
    return {
      success: false,
      error: t('Actions.createPatientFailed'),
    }
  }
}

export async function updatePatientAction(
  _: PatientFormState,
  formData: FormData
): Promise<PatientFormState> {
  const t = await getServerT()
  const id = formData.get('id')?.toString()
  const name = formData.get('name')?.toString().trim() || ''
  const birth_date = formData.get('birth_date')?.toString().trim() || ''
  const guardian_name = formData.get('guardian_name')?.toString().trim() || ''
  const guardian_email = formData.get('guardian_email')?.toString().trim() || ''
  const notes = formData.get('notes')?.toString().trim() || ''

  if (!id) {
    return { success: false, error: t('Actions.patientIdNotFound') }
  }

  const patientId = parseInt(id, 10)
  if (isNaN(patientId)) {
    return { success: false, error: t('Actions.patientIdInvalid') }
  }

  const errors: Record<string, string> = {}

  if (!name) {
    errors.name = t('Actions.nameRequired')
  }
  if (!birth_date) {
    errors.birth_date = t('Actions.birthDateRequired')
  }
  if (!guardian_name) {
    errors.guardian_name = t('Actions.guardianNameRequired')
  }
  if (!guardian_email) {
    errors.guardian_email = t('Actions.guardianEmailRequired')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guardian_email)) {
      errors.guardian_email = t('Actions.invalidEmail')
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const patientData: UpdatePatientInput = {
      name,
      birth_date,
      guardian_name,
      guardian_email,
      notes,
    }

    await updatePatient(patientId, patientData)

    revalidatePath('/clinic/patients')
    revalidatePath(`/clinic/patients/${patientId}`)
    revalidatePatients()
    revalidatePatient(patientId)
    return { success: true }
  } catch (error) {
    console.error('Failed to update patient:', error)
    return {
      success: false,
      error: t('Actions.updatePatientFailed'),
    }
  }
}
export async function deletePatientAction(patientId: number): Promise<void> {
  try {
    await deletePatient(patientId)
    revalidatePath('/clinic/patients')
    revalidatePatients()
    revalidatePatient(patientId)
    revalidateDashboard()
    return
  } catch (error) {
    console.error('Failed to delete patient:', error)
    throw error
  }
}

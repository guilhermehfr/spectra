'use server'

import { revalidatePath } from 'next/cache'
import { createPatient, updatePatient, deletePatient } from '@/lib/api/clinic'
import { revalidatePatients } from '@/lib/api/http'
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
  const name = formData.get('name')?.toString().trim() || ''
  const birth_date = formData.get('birth_date')?.toString().trim() || ''
  const guardian_name = formData.get('guardian_name')?.toString().trim() || ''
  const guardian_email = formData.get('guardian_email')?.toString().trim() || ''
  const notes = formData.get('notes')?.toString().trim() || ''

  const errors: Record<string, string> = {}

  if (!name) {
    errors.name = 'Nome é obrigatório'
  }
  if (!birth_date) {
    errors.birth_date = 'Data de nascimento é obrigatória'
  }
  if (!guardian_name) {
    errors.guardian_name = 'Responsável é obrigatório'
  }
  if (!guardian_email) {
    errors.guardian_email = 'Email do responsável é obrigatório'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guardian_email)) {
      errors.guardian_email = 'Email inválido'
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

    await createPatient(patientData)

    revalidatePath('/clinic/patients')
    revalidatePatients()
    return { success: true }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Failed to create patient:', error)
    return {
      success: false,
      error: 'Falha ao cadastrar paciente. Tente novamente.',
    }
  }
}

export async function updatePatientAction(
  _: PatientFormState,
  formData: FormData
): Promise<PatientFormState> {
  const id = formData.get('id')?.toString()
  const name = formData.get('name')?.toString().trim() || ''
  const birth_date = formData.get('birth_date')?.toString().trim() || ''
  const guardian_name = formData.get('guardian_name')?.toString().trim() || ''
  const guardian_email = formData.get('guardian_email')?.toString().trim() || ''
  const notes = formData.get('notes')?.toString().trim() || ''

  if (!id) {
    return { success: false, error: 'ID do paciente não encontrado' }
  }

  const patientId = parseInt(id, 10)
  if (isNaN(patientId)) {
    return { success: false, error: 'ID do paciente inválido' }
  }

  const errors: Record<string, string> = {}

  if (!name) {
    errors.name = 'Nome é obrigatório'
  }
  if (!birth_date) {
    errors.birth_date = 'Data de nascimento é obrigatória'
  }
  if (!guardian_name) {
    errors.guardian_name = 'Responsável é obrigatório'
  }
  if (!guardian_email) {
    errors.guardian_email = 'Email do responsável é obrigatório'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guardian_email)) {
      errors.guardian_email = 'Email inválido'
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
    return { success: true }
  } catch (error) {
    console.error('Failed to update patient:', error)
    return {
      success: false,
      error: 'Falha ao atualizar paciente. Tente novamente.',
    }
  }
}
export async function deletePatientAction(patientId: number): Promise<void> {
  try {
    await deletePatient(patientId)
    revalidatePath('/clinic/patients')
    revalidatePatients()
    return
  } catch (error) {
    console.error('Failed to delete patient:', error)
    throw error
  }
}

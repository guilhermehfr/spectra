'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSession, updateSession, deleteSession } from '@/lib/api/clinic'
import type { CreateSessionInput, UpdateSessionInput } from '@/lib/types'

export interface SessionFormState {
  success: boolean
  error?: string
  errors?: Record<string, string>
}

export async function createSessionAction(
  _: SessionFormState,
  formData: FormData
): Promise<SessionFormState> {
  const patient = formData.get('patient')?.toString()
  const therapist = formData.get('therapist')?.toString()
  const date_time = formData.get('date_time')?.toString() || ''
  const notes = formData.get('notes')?.toString().trim() || ''

  const errors: Record<string, string> = {}

  if (!patient) {
    errors.patient = 'Paciente é obrigatório'
  }
  if (!therapist) {
    errors.therapist = 'Terapeuta é obrigatório'
  }
  if (!date_time) {
    errors.date_time = 'Data e horário são obrigatórios'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const sessionData: CreateSessionInput = {
      patient: parseInt(patient!, 10),
      therapist: parseInt(therapist!, 10),
      date_time,
      status: 'scheduled',
      notes,
    }

    await createSession(sessionData)

    revalidatePath('/clinic/sessions')

    return { success: true }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Failed to create session:', error)
    return {
      success: false,
      error: 'Falha ao criar sessão. Tente novamente.',
    }
  }
}

export async function updateSessionAction(
  _: SessionFormState,
  formData: FormData
): Promise<SessionFormState> {
  const sessionId = formData.get('id')?.toString()
  const patient = formData.get('patient')?.toString()
  const therapist = formData.get('therapist')?.toString()
  const date_time = formData.get('date_time')?.toString() || ''
  const notes = formData.get('notes')?.toString().trim() || ''
  const status = formData.get('status')?.toString() as 'scheduled' | 'completed' | 'cancelled'

  if (!sessionId) {
    return { success: false, error: 'ID da sessão não encontrado' }
  }

  const id = parseInt(sessionId, 10)
  if (isNaN(id)) {
    return { success: false, error: 'ID da sessão inválido' }
  }

  const errors: Record<string, string> = {}

  if (!patient) {
    errors.patient = 'Paciente é obrigatório'
  }
  if (!therapist) {
    errors.therapist = 'Terapeuta é obrigatório'
  }
  if (!date_time) {
    errors.date_time = 'Data e horário são obrigatórios'
  }
  if (!status) {
    errors.status = 'Status é obrigatório'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const sessionData: UpdateSessionInput = {
      patient: parseInt(patient!, 10),
      therapist: parseInt(therapist!, 10),
      date_time,
      notes,
      status,
    }

    await updateSession(id, sessionData)

    revalidatePath('/clinic/sessions')
    revalidatePath(`/clinic/sessions/${id}`)

    return { success: true }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Failed to update session:', error)
    return {
      success: false,
      error: 'Falha ao atualizar sessão. Tente novamente.',
    }
  }
}

export async function deleteSessionAction(sessionId: number, patientId: number): Promise<void> {
  try {
    await deleteSession(sessionId)
    revalidatePath(`/clinic/patients/${patientId}`)
    revalidatePath('/clinic/sessions')
    redirect(`/clinic/patients/${patientId}`)
  } catch (error) {
    console.error('Failed to delete session:', error)
    throw error
  }
}

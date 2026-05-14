'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSession, updateSession, deleteSession, getSession } from '@/lib/api/clinic'
import { revalidateSessions, revalidateSession, revalidateEvolutions, revalidateFamilyEvolutions, revalidateDashboard } from '@/lib/api/http'
import { resolveUser } from '@/lib/utils/userUtils'
import { canEditSession, canDeleteSession } from '@/lib/utils/permissionUtils'
import type { CreateSessionInput, UpdateSessionInput } from '@/lib/types'

function convertToISO8601(dateTime: string): string {
  if (!dateTime) return dateTime
  if (dateTime.includes('Z')) return dateTime
  return `${dateTime}:00Z`
}

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
      date_time: convertToISO8601(date_time),
      status: 'scheduled',
      notes: notes || undefined,
    }

    const newSession = await createSession(sessionData)

    revalidatePath('/clinic/sessions')
    revalidatePath('/clinic/dashboard')
    revalidatePath(`/clinic/patients/${patient}`)
    revalidateSessions()
    if (newSession?.id) {
      revalidateSession(newSession.id)
    }
    revalidateEvolutions()
    revalidateFamilyEvolutions()
    revalidateDashboard()

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
  const status = formData.get('status')?.toString() as 'scheduled' | 'completed' | 'canceled'

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

  const user = await resolveUser()
  const existingSession = await getSession(id)

  if (!existingSession) {
    return { success: false, error: 'Sessão não encontrada' }
  }

  if (!canEditSession(existingSession, user)) {
    return { success: false, error: 'Você não tem permissão para editar esta sessão' }
  }

  try {
    const sessionData: UpdateSessionInput = {
      patient: parseInt(patient!, 10),
      therapist: parseInt(therapist!, 10),
      date_time: convertToISO8601(date_time),
      notes: notes || undefined,
      status,
    }

    await updateSession(id, sessionData)

    revalidatePath('/clinic/sessions')
    revalidatePath('/clinic/dashboard')
    revalidatePath(`/clinic/sessions/${id}`)
    revalidatePath(`/clinic/patients/${patient}`)
    revalidateSessions()
    revalidateSession(id)
    revalidateEvolutions()
    revalidateFamilyEvolutions()
    revalidateDashboard()

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
    const user = await resolveUser()
    const session = await getSession(sessionId)

    if (!session) {
      throw new Error('Sessão não encontrada')
    }

    if (!canDeleteSession(session, user)) {
      throw new Error('Você não tem permissão para excluir esta sessão')
    }

    await deleteSession(sessionId)
    revalidatePath(`/clinic/patients/${patientId}`)
    revalidatePath('/clinic/sessions')
    revalidatePath('/clinic/dashboard')
    revalidateSession(sessionId)
    revalidateSessions()
    revalidateEvolutions()
    revalidateFamilyEvolutions()
    revalidateDashboard()
    redirect(`/clinic/patients/${patientId}`)
  } catch (error) {
    console.error('Failed to delete session:', error)
    throw error
  }
}

'use server'

import { revalidatePath } from 'next/cache'
import { createEvolution, getEvolutions, getEvolution } from '@/lib/api/clinic'
import {
  revalidateEvolutions,
  revalidateEvolution,
  revalidatePatients,
  revalidateDashboard,
} from '@/lib/api/http'
import { resolveUser } from '@/lib/utils/userUtils'
import { canEditEvolution, canReleaseEvolution } from '@/lib/utils/permissionUtils'
import type { CreateEvolutionInput } from '@/lib/types'

export interface EvolutionFormState {
  success: boolean
  error?: string
  errors?: Record<string, string>
}

export async function createEvolutionAction(
  _: EvolutionFormState,
  formData: FormData
): Promise<EvolutionFormState> {
  const sessionId = formData.get('session')?.toString()
  const objective = formData.get('objective')?.toString().trim() || ''
  const activities = formData.get('activities')?.toString().trim() || ''
  const behavior = formData.get('behavior')?.toString().trim() || ''
  const progress = formData.get('progress')?.toString().trim() || ''
  const next_steps = formData.get('next_steps')?.toString().trim() || ''
  const released_to_family = formData.get('released_to_family') === 'on'

  const errors: Record<string, string> = {}

  if (!sessionId) {
    errors.session = 'Sessão não encontrada'
  }
  if (!objective) {
    errors.objective = 'Objetivo é obrigatório'
  }
  if (!activities) {
    errors.activities = 'Atividades é obrigatória'
  }
  if (!behavior) {
    errors.behavior = 'Comportamento é obrigatório'
  }
  if (!progress) {
    errors.progress = 'Progresso é obrigatório'
  }
  if (!next_steps) {
    errors.next_steps = 'Próximos passos são obrigatórios'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    const sessionIdNum = parseInt(sessionId!, 10)

    const { getSession } = await import('@/lib/api/clinic')
    const session = await getSession(sessionIdNum)

    if (!session) {
      return { success: false, error: 'Sessão não encontrada' }
    }

    const user = await resolveUser()

    if (session.therapist !== user.id && user.role !== 'admin') {
      return {
        success: false,
        error: 'Você não tem permissão para criar evolução para esta sessão',
      }
    }

    const evolutionData: CreateEvolutionInput = {
      session: sessionIdNum,
      objective,
      activities,
      behavior,
      progress,
      next_steps,
      released_to_family,
    }

    const newEvolution = await createEvolution(evolutionData)

    revalidatePath('/clinic/sessions')
    revalidatePath('/clinic/dashboard')
    revalidatePath(`/clinic/sessions/${sessionId}`)
    revalidateEvolutions()
    if (newEvolution?.id) {
      revalidateEvolution(newEvolution.id)
    }
    revalidateDashboard()

    // Get patient ID to invalidate patient detail
    if (session) {
      revalidatePath(`/clinic/patients/${session.patient}`)
    }

    return { success: true }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Failed to create evolution:', error)
    return {
      success: false,
      error: 'Falha ao criar evolução. Tente novamente.',
    }
  }
}

export async function getEvolutionBySession(sessionId: number) {
  const evolutions = await getEvolutions()
  return evolutions.find((e) => e.session === sessionId)
}
export async function updateEvolutionAction(
  _: EvolutionFormState,
  formData: FormData
): Promise<EvolutionFormState> {
  const evolutionId = formData.get('id')?.toString()
  const objective = formData.get('objective')?.toString().trim() || ''
  const activities = formData.get('activities')?.toString().trim() || ''
  const behavior = formData.get('behavior')?.toString().trim() || ''
  const progress = formData.get('progress')?.toString().trim() || ''
  const next_steps = formData.get('next_steps')?.toString().trim() || ''
  const released_to_family = formData.get('released_to_family') === 'on'

  if (!evolutionId) {
    return { success: false, error: 'ID da evolução não encontrado' }
  }

  const id = parseInt(evolutionId, 10)
  if (isNaN(id)) {
    return { success: false, error: 'ID da evolução inválido' }
  }

  const errors: Record<string, string> = {}

  if (!objective) {
    errors.objective = 'Objetivo é obrigatório'
  }
  if (!activities) {
    errors.activities = 'Atividades é obrigatória'
  }
  if (!behavior) {
    errors.behavior = 'Comportamento é obrigatório'
  }
  if (!progress) {
    errors.progress = 'Progresso é obrigatório'
  }
  if (!next_steps) {
    errors.next_steps = 'Próximos passos são obrigatórios'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  const user = await resolveUser()
  const existingEvolution = await getEvolution(id)

  if (!existingEvolution) {
    return { success: false, error: 'Evolução não encontrada' }
  }

  const { getSession } = await import('@/lib/api/clinic')
  const session = await getSession(existingEvolution.session)
  if (!session) {
    return { success: false, error: 'Sessão não encontrada' }
  }

  if (!canEditEvolution(existingEvolution, user, session.therapist)) {
    return { success: false, error: 'Você não tem permissão para editar esta evolução' }
  }

  try {
    const { updateEvolution } = await import('@/lib/api/clinic')

    await updateEvolution(id, {
      objective,
      activities,
      behavior,
      progress,
      next_steps,
      released_to_family,
    })

    revalidatePath('/clinic/sessions')
    revalidatePath('/clinic/evolutions')
    revalidatePath('/clinic/dashboard')
    revalidateEvolutions()
    if (id) {
      revalidateEvolution(id)
    }

    // Get session to invalidate patient detail
    const { getEvolution } = await import('@/lib/api/clinic')
    const evolution = await getEvolution(id)
    if (evolution) {
      const { getSession } = await import('@/lib/api/clinic')
      const session = await getSession(evolution.session)
      if (session) {
        revalidatePath(`/clinic/patients/${session.patient}`)
      }
      revalidatePath(`/clinic/sessions/${evolution.session}`)
    }

    return { success: true }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Failed to update evolution:', error)
    return {
      success: false,
      error: 'Falha ao atualizar evolução. Tente novamente.',
    }
  }
}

export interface ReleaseEvolutionState {
  success: boolean
  error?: string
}

export async function releaseEvolutionAction(evolutionId: number): Promise<ReleaseEvolutionState> {
  try {
    const { patchEvolution, getEvolution, getSession } = await import('@/lib/api/clinic')

    const existing = await getEvolution(evolutionId)
    if (!existing) {
      return { success: false, error: 'Evolução não encontrada.' }
    }

    const session = await getSession(existing.session)
    if (!session) {
      return { success: false, error: 'Sessão não encontrada.' }
    }

    const user = await resolveUser()
    if (!canReleaseEvolution(existing, user, session.therapist)) {
      return { success: false, error: 'Você não tem permissão para liberar esta evolução.' }
    }

    await patchEvolution(evolutionId, {
      released_to_family: true,
    })

    revalidatePatients()
    revalidateEvolution(evolutionId)
    revalidatePath('/clinic/patients')
    revalidatePath('/family/dashboard')
    revalidatePath('/family/evolutions')
    if (existing) {
      revalidatePath(`/clinic/patients/${existing.session}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to release evolution:', error)
    return {
      success: false,
      error: 'Falha ao liberar evolução para a família. Tente novamente.',
    }
  }
}

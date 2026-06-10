/**
 * Mock Implementation of Clinic API
 *
 * This module provides the same interface as clinic.ts but operates
 * directly on the centralized mock state without making HTTP requests.
 *
 * Used when NEXT_PUBLIC_DISABLE_MSW=false (default in development).
 */

import * as state from '@/mocks/state'
import type {
  CreateEvolutionInput,
  CreatePatientInput,
  CreateSessionInput,
  Dashboard,
  Evolution,
  Patient,
  Session,
  UpdateEvolutionInput,
  UpdatePatientInput,
  UpdateSessionInput,
  User,
} from '@/lib/types'

export function getPatients(): Promise<Patient[]> {
  return Promise.resolve(state.getPatients())
}

export function getPatient(id: number): Promise<Patient | undefined> {
  return Promise.resolve(state.getPatientById(id))
}

export async function getPatientByGuardianEmail(email: string): Promise<Patient | null> {
  return Promise.resolve(state.getPatientByGuardianEmail(email))
}

export function createPatient(data: CreatePatientInput): Promise<Patient> {
  try {
    const result = state.createPatient(data)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function updatePatient(id: number, data: UpdatePatientInput): Promise<Patient | undefined> {
  try {
    const result = state.updatePatient(id, data)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function deletePatient(id: number): Promise<void> {
  try {
    state.deletePatient(id)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

export function getSessions(options?: {
  patient?: number
  therapist?: number
}): Promise<Session[]> {
  let sessions = state.getSessions()
  if (options?.patient) {
    sessions = sessions.filter((s) => s.patient === options.patient)
  }
  if (options?.therapist) {
    sessions = sessions.filter((s) => s.therapist === options.therapist)
  }
  return Promise.resolve(sessions)
}

export function getSession(id: number): Promise<Session | undefined> {
  return Promise.resolve(state.getSessionById(id))
}

export function createSession(data: CreateSessionInput): Promise<Session> {
  try {
    const sessionData: Omit<
      Session,
      'id' | 'patient_name' | 'therapist_name' | 'is_deleted' | 'created_at' | 'updated_at'
    > = {
      patient: data.patient,
      therapist: data.therapist,
      date_time: data.date_time,
      status: data.status || 'scheduled',
      notes: data.notes || '',
    }
    const result = state.createSession(sessionData)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function updateSession(id: number, data: UpdateSessionInput): Promise<Session | undefined> {
  try {
    const result = state.updateSession(id, data)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function deleteSession(id: number): Promise<void> {
  try {
    state.deleteSession(id)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

export function getEvolutions(options?: {
  session?: number
  therapist?: number
}): Promise<Evolution[]> {
  let evolutions = state.getEvolutions()
  if (options?.session) {
    evolutions = evolutions.filter((e) => e.session === options.session)
  }
  if (options?.therapist) {
    evolutions = evolutions.filter((e) => e.therapist_name)
  }
  return Promise.resolve(evolutions)
}

export function getEvolution(id: number): Promise<Evolution | undefined> {
  return Promise.resolve(state.getEvolutionById(id))
}

export function createEvolution(data: CreateEvolutionInput): Promise<Evolution> {
  try {
    const session = state.getSessionById(data.session)
    if (!session || session.status !== 'completed') {
      throw new Error('Session must be completed.')
    }

    const currentUser = state.getCurrentUser()
    const authorName = currentUser
      ? `${currentUser.first_name} ${currentUser.last_name}`.trim() || currentUser.username
      : null

    const evolutionData: Omit<Evolution, 'id' | 'created_at' | 'updated_at'> = {
      session: data.session,
      session_date: session.date_time,
      therapist_name: session.therapist_name,
      author_name: authorName,
      objective: data.objective,
      activities: data.activities,
      behavior: data.behavior,
      progress: data.progress,
      next_steps: data.next_steps,
      released_to_family: data.released_to_family ?? false,
    }
    const result = state.createEvolution(evolutionData)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function updateEvolution(
  id: number,
  data: UpdateEvolutionInput
): Promise<Evolution | undefined> {
  try {
    const result = state.updateEvolution(id, data)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function patchEvolution(
  id: number,
  data: Partial<UpdateEvolutionInput>
): Promise<Evolution | undefined> {
  try {
    const result = state.updateEvolution(id, data)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function getDashboard(): Promise<Dashboard> {
  return Promise.resolve(state.getDashboardMetrics())
}

export function getTherapists(): Promise<User[]> {
  return Promise.resolve(state.getTherapists())
}

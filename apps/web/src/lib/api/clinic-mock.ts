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

export function getSessions(): Promise<Session[]> {
  return Promise.resolve(state.getSessions())
}

export function getSession(id: number): Promise<Session | undefined> {
  return Promise.resolve(state.getSessionById(id))
}

export function createSession(data: CreateSessionInput): Promise<Session> {
  try {
    const sessionData: Omit<Session, 'id' | 'patient_name' | 'therapist_name' | 'is_deleted' | 'created_at' | 'updated_at'> = {
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

export function getEvolutions(): Promise<Evolution[]> {
  return Promise.resolve(state.getEvolutions())
}

export function getEvolution(id: number): Promise<Evolution | undefined> {
  return Promise.resolve(state.getEvolutionById(id))
}

export function createEvolution(data: CreateEvolutionInput): Promise<Evolution> {
  try {
    // Get the session to extract session_date and therapist_name
    const session = state.getSessionById(data.session)
    if (!session || session.status !== 'completed') {
      throw new Error('A sessão precisa estar com status completed.')
    }

    const evolutionData: Omit<Evolution, 'id' | 'created_at' | 'updated_at'> = {
      session: data.session,
      session_date: session.date_time,
      therapist_name: session.therapist_name,
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

export function updateEvolution(id: number, data: UpdateEvolutionInput): Promise<Evolution | undefined> {
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

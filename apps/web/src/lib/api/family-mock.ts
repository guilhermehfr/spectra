/**
 * Mock Implementation of Family API
 *
 * This module provides the same interface as family.ts but operates
 * directly on the centralized mock state without making HTTP requests.
 *
 * Used when NEXT_PUBLIC_DISABLE_MSW=false (default in development).
 */

import * as state from '@/mocks/state'
import type { FamilyEvolution, Patient } from '@/lib/types'

export function getPatientByGuardianEmail(): Promise<Patient> {
  const user = state.getCurrentUser()
  if (!user) return Promise.reject(new Error('Not authenticated'))
  const patient = state.getPatientByGuardianEmail(user.email)
  if (!patient) return Promise.reject(new Error('Patient not found'))
  return Promise.resolve(patient)
}

export function getFamilyEvolutions(): Promise<FamilyEvolution[]> {
  const evolutions = state.getFamilyEvolutions()

  const familyEvolutions: FamilyEvolution[] = evolutions
    .filter((e) => e.released_to_family)
    .map((e) => ({
      id: e.id,
      session: e.session,
      session_date: e.session_date,
      therapist_name: e.therapist_name,
      author_name: e.author_name || null,
      objective: e.objective,
      activities: e.activities,
      behavior: e.behavior,
      progress: e.progress,
      next_steps: e.next_steps,
      created_at: e.created_at,
      released_to_family: e.released_to_family,
    }))

  return Promise.resolve(familyEvolutions)
}

export function getFamilyEvolution(id: number): Promise<FamilyEvolution | undefined> {
  const evolution = state.getEvolutionById(id)

  if (!evolution) {
    return Promise.resolve(undefined)
  }

  // Only return if released to family
  if (!evolution.released_to_family) {
    return Promise.resolve(undefined)
  }

  const familyEvolution: FamilyEvolution = {
    id: evolution.id,
    session: evolution.session,
    session_date: evolution.session_date,
    therapist_name: evolution.therapist_name,
    author_name: evolution.author_name || null,
    objective: evolution.objective,
    activities: evolution.activities,
    behavior: evolution.behavior,
    progress: evolution.progress,
    next_steps: evolution.next_steps,
    created_at: evolution.created_at,
    released_to_family: evolution.released_to_family,
  }

  return Promise.resolve(familyEvolution)
}

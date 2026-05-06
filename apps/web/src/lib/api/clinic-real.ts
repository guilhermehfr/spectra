/**
 * Real Clinic API Implementation
 *
 * This module uses the HTTP client to make actual requests to the backend API.
 * It's the original implementation that was in clinic.ts before the refactor.
 *
 * Only loaded when NEXT_PUBLIC_DISABLE_MSW=true.
 */

import { http } from '@/lib/api/http'

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

export function getPatients() {
  return http<Patient[]>('/api/patients/')
}

export function getPatient(id: number) {
  return http<Patient>(`/api/patients/${id}/`)
}

export async function getPatientByGuardianEmail(email: string) {
  const patients = await getPatients()
  return patients.find((p) => p.guardian_email === email) || null
}

export function createPatient(data: CreatePatientInput) {
  return http<Patient>('/api/patients/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updatePatient(id: number, data: UpdatePatientInput) {
  return http<Patient>(`/api/patients/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deletePatient(id: number) {
  return http(`/api/patients/${id}/`, {
    method: 'DELETE',
  })
}

export function getSessions() {
  return http<Session[]>('/api/sessions/')
}

export function getSession(id: number) {
  return http<Session>(`/api/sessions/${id}/`)
}

export function createSession(data: CreateSessionInput) {
  return http<Session>('/api/sessions/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateSession(id: number, data: UpdateSessionInput) {
  return http<Session>(`/api/sessions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteSession(id: number) {
  return http(`/api/sessions/${id}/`, {
    method: 'DELETE',
  })
}

export function getEvolutions() {
  return http<Evolution[]>('/api/evolutions/')
}

export function getEvolution(id: number) {
  return http<Evolution>(`/api/evolutions/${id}/`)
}

export function createEvolution(data: CreateEvolutionInput) {
  return http<Evolution>('/api/evolutions/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateEvolution(id: number, data: UpdateEvolutionInput) {
  return http<Evolution>(`/api/evolutions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getDashboard() {
  return http<Dashboard>('/api/dashboard/')
}

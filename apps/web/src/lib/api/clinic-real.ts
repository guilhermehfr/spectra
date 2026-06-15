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
  User,
} from '@/lib/types'

export async function getPatients() {
  const response = await http<{ results: Patient[] }>('/api/patients/', { tags: ['patients-list'] })
  return response.results
}

export function getPatient(id: number) {
  return http<Patient>(`/api/patients/${id}/`, { tags: [`patient-${id}`] })
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

export async function getSessions(options?: { patient?: number; therapist?: number }) {
  const params = new URLSearchParams()
  if (options?.patient) params.append('patient', options.patient.toString())
  if (options?.therapist) params.append('therapist', options.therapist.toString())
  const query = params.toString()
  const url = `/api/sessions/${query ? '?' + query : ''}`
  const response = await http<{ results: Session[] }>(url, { tags: ['sessions-list'] })
  return response.results
}

export function getSession(id: number) {
  return http<Session>(`/api/sessions/${id}/`, { tags: [`session-${id}`] })
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

export async function getEvolutions(options?: { session?: number; therapist?: number }) {
  const params = new URLSearchParams()
  if (options?.session) params.append('session', options.session.toString())
  if (options?.therapist) params.append('therapist', options.therapist.toString())
  const query = params.toString()
  const url = `/api/evolutions/${query ? '?' + query : ''}`
  const response = await http<{ results: Evolution[] }>(url, { tags: ['evolutions-list'] })
  return response.results
}

export function getEvolution(id: number) {
  return http<Evolution>(`/api/evolutions/${id}/`, { tags: [`evolution-${id}`] })
}

export function createEvolution(data: CreateEvolutionInput) {
  return http<Evolution>('/api/evolutions/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateEvolution(id: number, data: UpdateEvolutionInput) {
  return http<Evolution>(`/api/evolutions/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function patchEvolution(id: number, data: Partial<UpdateEvolutionInput>) {
  return http<Evolution>(`/api/evolutions/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function getDashboard() {
  return http<Dashboard>('/api/dashboard/', { next: { tags: ['dashboard'] } })
}

export function getTherapists() {
  return http<User[]>('/api/therapists/')
}

/**
 * Clinic API Module
 * 
 * Conditionally exports either mock or real API implementations based on
 * the NEXT_PUBLIC_DISABLE_MSW environment variable.
 * 
 * - NEXT_PUBLIC_DISABLE_MSW=false (default in dev): Uses mock implementation
 *   that operates on centralized in-memory state (no fetch calls)
 * - NEXT_PUBLIC_DISABLE_MSW=true (prod/real API): Uses HTTP client to make
 *   actual requests to the backend API
 */

import type {
  CreateEvolutionInput,
  CreatePatientInput,
  CreateSessionInput,
  UpdateEvolutionInput,
  UpdatePatientInput,
  UpdateSessionInput,
} from '@/lib/types'

const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

// Lazy-load implementations to avoid circular dependencies and unused code
const getImpl = async () => {
  if (useMock) {
    return import('@/lib/api/clinic-mock')
  } else {
    return import('@/lib/api/clinic-real')
  }
}

/**
 * Get all active (non-deleted) patients
 */
export async function getPatients() {
  const impl = await getImpl()
  return impl.getPatients()
}

/**
 * Get a specific patient by ID
 */
export async function getPatient(id: number) {
  const impl = await getImpl()
  return impl.getPatient(id)
}

/**
 * Get patient by guardian email (useful for family portal)
 */
export async function getPatientByGuardianEmail(email: string) {
  const impl = await getImpl()
  return impl.getPatientByGuardianEmail(email)
}

/**
 * Create a new patient
 */
export async function createPatient(data: CreatePatientInput) {
  const impl = await getImpl()
  return impl.createPatient(data)
}

/**
 * Update an existing patient
 */
export async function updatePatient(id: number, data: UpdatePatientInput) {
  const impl = await getImpl()
  return impl.updatePatient(id, data)
}

/**
 * Delete (soft-delete) a patient
 */
export async function deletePatient(id: number) {
  const impl = await getImpl()
  return impl.deletePatient(id)
}

/**
 * Get all active (non-deleted) sessions
 */
export async function getSessions() {
  const impl = await getImpl()
  return impl.getSessions()
}

/**
 * Get a specific session by ID
 */
export async function getSession(id: number) {
  const impl = await getImpl()
  return impl.getSession(id)
}

/**
 * Create a new therapy session
 */
export async function createSession(data: CreateSessionInput) {
  const impl = await getImpl()
  return impl.createSession(data)
}

/**
 * Update an existing session
 */
export async function updateSession(id: number, data: UpdateSessionInput) {
  const impl = await getImpl()
  return impl.updateSession(id, data)
}

/**
 * Delete (soft-delete) a session
 */
export async function deleteSession(id: number) {
  const impl = await getImpl()
  return impl.deleteSession(id)
}

/**
 * Get all evolutions
 */
export async function getEvolutions() {
  const impl = await getImpl()
  return impl.getEvolutions()
}

/**
 * Get a specific evolution by ID
 */
export async function getEvolution(id: number) {
  const impl = await getImpl()
  return impl.getEvolution(id)
}

/**
 * Create a new evolution (therapy notes) for a session
 */
export async function createEvolution(data: CreateEvolutionInput) {
  const impl = await getImpl()
  return impl.createEvolution(data)
}

/**
 * Update an existing evolution
 */
export async function updateEvolution(id: number, data: UpdateEvolutionInput) {
  const impl = await getImpl()
  return impl.updateEvolution(id, data)
}

/**
 * Get dashboard metrics
 */
export async function getDashboard() {
  const impl = await getImpl()
  return impl.getDashboard()
}

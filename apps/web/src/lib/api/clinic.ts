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
 *
 * Note: React cache() was removed to fix caching issues with new patient creation.
 * Each call now fetches fresh data from the API.
 */

import type {
  CreateEvolutionInput,
  CreatePatientInput,
  CreateSessionInput,
  UpdateEvolutionInput,
  UpdatePatientInput,
  UpdateSessionInput,
} from '@/lib/types'

import { getUseMock } from '@/lib/envUtils'

const getImpl = async () => {
  const useMock = getUseMock()
  if (useMock) {
    return import('@/lib/api/clinic-mock')
  } else {
    return import('@/lib/api/clinic-real')
  }
}

export async function getPatients() {
  const impl = await getImpl()
  return impl.getPatients()
}

export async function getPatient(id: number) {
  const impl = await getImpl()
  return impl.getPatient(id)
}

export async function getPatientByGuardianEmail(email: string) {
  const impl = await getImpl()
  return impl.getPatientByGuardianEmail(email)
}

export async function createPatient(data: CreatePatientInput) {
  const impl = await getImpl()
  return impl.createPatient(data)
}

export async function updatePatient(id: number, data: UpdatePatientInput) {
  const impl = await getImpl()
  return impl.updatePatient(id, data)
}

export async function deletePatient(id: number) {
  const impl = await getImpl()
  return impl.deletePatient(id)
}

export async function getSessions() {
  const impl = await getImpl()
  return impl.getSessions()
}

export async function getSession(id: number) {
  const impl = await getImpl()
  return impl.getSession(id)
}

export async function createSession(data: CreateSessionInput) {
  const impl = await getImpl()
  return impl.createSession(data)
}

export async function updateSession(id: number, data: UpdateSessionInput) {
  const impl = await getImpl()
  return impl.updateSession(id, data)
}

export async function deleteSession(id: number) {
  const impl = await getImpl()
  return impl.deleteSession(id)
}

export async function getEvolutions() {
  const impl = await getImpl()
  return impl.getEvolutions()
}

export async function getEvolution(id: number) {
  const impl = await getImpl()
  return impl.getEvolution(id)
}

export async function createEvolution(data: CreateEvolutionInput) {
  const impl = await getImpl()
  return impl.createEvolution(data)
}

export async function updateEvolution(id: number, data: UpdateEvolutionInput) {
  const impl = await getImpl()
  return impl.updateEvolution(id, data)
}

export async function patchEvolution(id: number, data: Partial<UpdateEvolutionInput>) {
  const impl = await getImpl()
  return impl.patchEvolution(id, data)
}

export async function getDashboard() {
  const impl = await getImpl()
  return impl.getDashboard()
}

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
 * All functions are wrapped with React cache() for request-scoped memoization.
 */

import { cache } from 'react'
import type {
  CreateEvolutionInput,
  CreatePatientInput,
  CreateSessionInput,
  UpdateEvolutionInput,
  UpdatePatientInput,
  UpdateSessionInput,
} from '@/lib/types'

const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

const getImpl = async () => {
  if (useMock) {
    return import('@/lib/api/clinic-mock')
  } else {
    return import('@/lib/api/clinic-real')
  }
}

export const getPatients = cache(async () => {
  const impl = await getImpl()
  return impl.getPatients()
})

export const getPatient = cache(async (id: number) => {
  const impl = await getImpl()
  return impl.getPatient(id)
})

export const getPatientByGuardianEmail = cache(async (email: string) => {
  const impl = await getImpl()
  return impl.getPatientByGuardianEmail(email)
})

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

export const getSessions = cache(async () => {
  const impl = await getImpl()
  return impl.getSessions()
})

export const getSession = cache(async (id: number) => {
  const impl = await getImpl()
  return impl.getSession(id)
})

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

export const getEvolutions = cache(async () => {
  const impl = await getImpl()
  return impl.getEvolutions()
})

export const getEvolution = cache(async (id: number) => {
  const impl = await getImpl()
  return impl.getEvolution(id)
})

export async function createEvolution(data: CreateEvolutionInput) {
  const impl = await getImpl()
  return impl.createEvolution(data)
}

export async function updateEvolution(id: number, data: UpdateEvolutionInput) {
  const impl = await getImpl()
  return impl.updateEvolution(id, data)
}

export const getDashboard = cache(async () => {
  const impl = await getImpl()
  return impl.getDashboard()
})

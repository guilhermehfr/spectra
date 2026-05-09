/**
 * Family API Module
 *
 * Conditionally exports either mock or real API implementations based on
 * the NEXT_PUBLIC_DISABLE_MSW environment variable.
 *
 * - NEXT_PUBLIC_DISABLE_MSW=false (default in dev): Uses mock implementation
 *   that operates on centralized in-memory state (no fetch calls)
 * - NEXT_PUBLIC_DISABLE_MSW=true (prod/real API): Uses HTTP client to make
 *   actual requests to the backend API
 *
 * Note: React cache() was removed to fix caching issues.
 * Each call now fetches fresh data from the API.
 */

import { getUseMock } from '@/lib/envUtils'

const getImpl = async () => {
  const useMock = getUseMock()
  if (useMock) {
    return import('@/lib/api/family-mock')
  } else {
    return import('@/lib/api/family-real')
  }
}

export async function getFamilyEvolutions() {
  const impl = await getImpl()
  return impl.getFamilyEvolutions()
}

export async function getFamilyEvolution(id: number) {
  const impl = await getImpl()
  return impl.getFamilyEvolution(id)
}

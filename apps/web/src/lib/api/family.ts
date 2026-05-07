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
 * All functions are wrapped with React cache() for request-scoped memoization.
 */

import { cache } from 'react'

const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

const getImpl = async () => {
  if (useMock) {
    return import('@/lib/api/family-mock')
  } else {
    return import('@/lib/api/family-real')
  }
}

export const getFamilyEvolutions = cache(async () => {
  const impl = await getImpl()
  return impl.getFamilyEvolutions()
})

export const getFamilyEvolution = cache(async (id: number) => {
  const impl = await getImpl()
  return impl.getFamilyEvolution(id)
})

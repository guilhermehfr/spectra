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
 */

const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

// Lazy-load implementations to avoid circular dependencies and unused code
const getImpl = async () => {
  if (useMock) {
    return import('@/lib/api/family-mock')
  } else {
    return import('@/lib/api/family-real')
  }
}

/**
 * Get all evolutions released to family members
 */
export async function getFamilyEvolutions() {
  const impl = await getImpl()
  return impl.getFamilyEvolutions()
}

/**
 * Get a specific evolution by ID (only if released to family)
 */
export async function getFamilyEvolution(id: number) {
  const impl = await getImpl()
  return impl.getFamilyEvolution(id)
}

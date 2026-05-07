/**
 * Real Family API Implementation
 *
 * This module uses the HTTP client to make actual requests to the backend API.
 * It's the original implementation that was in family.ts before the refactor.
 *
 * Only loaded when NEXT_PUBLIC_DISABLE_MSW=true.
 */

import { http } from '@/lib/api/http'

import type { FamilyEvolution } from '@/lib/types'

export function getFamilyEvolutions() {
  return http<FamilyEvolution[]>('/api/evolutions/family/')
}

export function getFamilyEvolution(id: number) {
  return http<FamilyEvolution>(`/api/evolutions/${id}/`)
}

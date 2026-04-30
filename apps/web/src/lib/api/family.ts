import { http } from '@/lib/api/http'

import type { FamilyEvolution } from '@/lib/types'

export function getFamilyEvolutions() {
  return http<FamilyEvolution[]>('/api/evolutions/family/')
}

export function getFamilyEvolution(id: number) {
  return http<FamilyEvolution>(`/api/evolutions/${id}/`)
}

import { http } from '@/lib/api/http'

import type { AuthResponse } from '@/lib/types'

export type LoginCredentials = {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return http<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

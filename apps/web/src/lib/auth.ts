import { http } from '@/lib/api/http'
import type { AuthResponse, LoginCredentials, User } from './types'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return http<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function me(): Promise<User> {
  return http<User>('/api/auth/me/')
}

export async function logout(): Promise<void> {
  await http('/api/auth/logout/', {
    method: 'POST',
  })
}

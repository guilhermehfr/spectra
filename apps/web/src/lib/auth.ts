import { http } from '@/lib/api/http'

import type { AuthResponse, User } from '@/lib/types'

export type LoginCredentials = {
  email: string
  password: string
}

type UserBasicInfo = Pick<User, 'id' | 'role' | 'email' | 'username'>

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return http<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function me(): Promise<UserBasicInfo> {
  return http<UserBasicInfo>('/api/auth/me/')
}

export async function logout(): Promise<void> {
  await http('/api/auth/logout/', {
    method: 'POST',
  })
}

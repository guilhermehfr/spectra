/**
 * Mock Authentication Implementation
 *
 * Uses centralized mock state to manage user authentication.
 * Does not make any HTTP requests.
 */

import * as mockState from '@/mocks/state'
import { mockUsers } from '@/mocks/data/users'
import type { AuthResponse, UserRole, User } from './types'

type MockUser = (typeof mockUsers)[0]

export async function loginMock(
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string
): Promise<AuthResponse> {
  const user = mockUsers.find((u) => u.email === email) as MockUser | undefined

  if (!user) {
    throw new Error('Email não encontrado.')
  }

  mockState.setCurrentUser(user as unknown as User)

  return {
    access: mockState.getMockTokens().access,
    refresh: mockState.getMockTokens().refresh,
    user: user as AuthResponse['user'],
  }
}

export async function meMock(): Promise<User> {
  const userId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID) || 0
  const currentUser = mockState.getCurrentUser()
  const user = (currentUser ?? mockUsers[userId] ?? mockUsers[0]) as MockUser

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role as UserRole,
    phone: user.phone,
    is_active: user.is_active,
  }
}

export function logoutMock(): void {
  mockState.clearCurrentUser()
}

/**
 * Mock Authentication Implementation
 * 
 * Uses centralized mock state to manage user authentication.
 * Does not make any HTTP requests.
 */

import * as mockState from '@/mocks/state'
import { mockUsers } from '@/mocks/data/users'
import type { AuthResponse, UserBasicInfo, UserRole, User } from './types'

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

export async function meMock(): Promise<UserBasicInfo> {
  const userId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID) || 0
  const currentUser = mockState.getCurrentUser()
  const user = (currentUser ?? mockUsers[userId] ?? mockUsers[0]) as MockUser

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as UserRole,
  }
}

export function logoutMock(): void {
  mockState.clearCurrentUser()
}
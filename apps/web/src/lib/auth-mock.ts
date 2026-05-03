import { mockUsers, mockTokens } from '@/mocks/data/users'
import type { AuthResponse, UserBasicInfo, UserRole } from './types'

type MockUser = (typeof mockUsers)[0]

let currentUser: MockUser | null = null

export function clearCurrentUser(): void {
  currentUser = null
}

export async function loginMock(
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string
): Promise<AuthResponse> {
  const user = mockUsers.find((u) => u.email === email) as MockUser | undefined

  if (!user) {
    throw new Error('Email não encontrado.')
  }

  currentUser = user

  return {
    access: mockTokens.access,
    refresh: mockTokens.refresh,
    user: user as AuthResponse['user'],
  }
}

export async function meMock(): Promise<UserBasicInfo> {
  const userId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID) || 0
  const user = (currentUser ?? mockUsers[userId] ?? mockUsers[0]) as MockUser

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as UserRole,
  }
}

export function logoutMock(): void {
  currentUser = null
}
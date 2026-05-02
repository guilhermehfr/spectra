import { mockUsers, mockTokens } from '@/mocks/data/users'

export type AuthResponse = {
  access: string
  refresh: string
  user: (typeof mockUsers)[0]
}

type UserBasicInfo = Pick<(typeof mockUsers)[0], 'id' | 'role' | 'email' | 'username'>

// Module-level state to track the currently logged-in user
let currentUser: (typeof mockUsers)[0] | null = null

export function clearCurrentUser(): void {
  currentUser = null
}

export async function loginMock(
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string
): Promise<AuthResponse> {
  const user = mockUsers.find((u) => u.email === email)

  if (!user) {
    throw new Error('Email não encontrado.')
  }

  currentUser = user

  return {
    access: mockTokens.access,
    refresh: mockTokens.refresh,
    user,
  }
}

export async function meMock(): Promise<UserBasicInfo> {
  const userId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID) || 0
  const user = currentUser ?? mockUsers[userId] ?? mockUsers[0]

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  }
}
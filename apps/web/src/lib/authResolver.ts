import { cache } from 'react'
import { authService } from './authService'
import { mockUsers } from '@/mocks/data/users'
import type { User, UserRole } from './types'

const COOKIE_NAME = 'access_token'

function getUseMock(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'
}

function getMockUser(userId: number): User | null {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role as UserRole,
    phone: user.phone,
    is_active: user.is_active,
  }
}

const getUserUncached = async (cookieValue?: string): Promise<User | null> => {
  if (!cookieValue) {
    if (getUseMock()) {
      const defaultUserId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID) || 1
      return getMockUser(defaultUserId)
    }
    return null
  }

  const userId = Number(cookieValue)

  if (getUseMock()) {
    return getMockUser(userId)
  }

  try {
    return await authService.me()
  } catch {
    return null
  }
}

export const getUser = cache(getUserUncached)

export const authResolver = {
  getUser,

  getCookieName: () => COOKIE_NAME,
}

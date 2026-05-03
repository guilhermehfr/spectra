import { authService } from './authService'
import { mockUsers } from '@/mocks/data/users'
import type { UserBasicInfo, UserRole } from './types'

const COOKIE_NAME = 'access_token'

function getUseMock(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'
}

function getMockUser(userId: number): UserBasicInfo | null {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as UserRole,
  }
}

export const authResolver = {
  getUser: async (cookieValue?: string): Promise<UserBasicInfo | null> => {
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
  },

  getCookieName: () => COOKIE_NAME,
}
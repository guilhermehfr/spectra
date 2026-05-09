import { login as loginReal, me as meReal, logout as logoutReal } from './auth'
import { loginMock, meMock, logoutMock } from './auth-mock'
import type { LoginCredentials, AuthResponse, User } from './types'

import { getUseMock } from '@/lib/envUtils'

export const useMock = getUseMock()

export const authService = useMock
  ? {
      login: (credentials: LoginCredentials) => loginMock(credentials.email, credentials.password),
      me: meMock,
      logout: logoutMock,
    }
  : {
      login: loginReal,
      me: meReal,
      logout: logoutReal,
    }

export type { LoginCredentials, AuthResponse, User }

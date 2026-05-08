import { NextResponse, type NextRequest } from 'next/server'
import { authResolver } from '@/lib/authResolver'
import { mockUsers } from '@/mocks/data/users'
import type { User } from '@/lib/types'

const MOCK_USER_IDS = {
  clinic: 2,
  family: 4,
}

import { getUseMock } from '@/lib/envUtils'

function getMockUserForRoute(pathname: string): User | null {
  const isFamily = pathname.startsWith('/family')
  const mockUserId = isFamily ? MOCK_USER_IDS.family : MOCK_USER_IDS.clinic
  const user = mockUsers.find((u) => u.id === mockUserId)

  if (!user) return null

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role as User['role'],
    phone: user.phone,
    is_active: user.is_active,
  }
}

async function getUserFromCookie(request: NextRequest, pathname: string) {
  const cookieValue = request.cookies.get(authResolver.getCookieName())?.value

  if (!cookieValue && getUseMock()) {
    return getMockUserForRoute(pathname)
  }

  return authResolver.getUser(cookieValue)
}

function isPublicRoute(pathname: string) {
  return pathname.startsWith('/login/')
}

function isRootRoute(pathname: string) {
  return pathname === '/'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (isRootRoute(pathname)) {
    const user = await getUserFromCookie(request, pathname)
    if (user?.role) {
      const destination = user.role === 'family' ? '/family/dashboard' : '/clinic/dashboard'
      return NextResponse.redirect(new URL(destination, request.url))
    }
    return NextResponse.redirect(new URL('/login/clinic', request.url))
  }

  const user = await getUserFromCookie(request, pathname)
  const userRole = user?.role

  if (!user || !userRole) {
    const isFamily = pathname.startsWith('/family')
    const loginPage = isFamily ? '/login/family' : '/login/clinic'
    return NextResponse.redirect(new URL(loginPage, request.url))
  }

  if (pathname.startsWith('/login/')) {
    const destination = userRole === 'family' ? '/family/dashboard' : '/clinic/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  const response = NextResponse.next()
  response.headers.set('x-user', JSON.stringify(user))
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

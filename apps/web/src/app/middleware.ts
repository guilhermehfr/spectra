import { NextResponse, type NextRequest } from 'next/server'

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@spectra.com',
    first_name: 'Admin',
    last_name: 'Spectra',
    role: 'admin',
  },
  {
    id: 2,
    username: 'terapeuta1',
    email: 'ana@spectra.com',
    first_name: 'Ana',
    last_name: 'Lima',
    role: 'therapist',
  },
  {
    id: 3,
    username: 'terapeuta2',
    email: 'carlos@spectra.com',
    first_name: 'Carlos',
    last_name: 'Souza',
    role: 'therapist',
  },
  {
    id: 4,
    username: 'familia1',
    email: 'maria@gmail.com',
    first_name: 'Maria',
    last_name: 'Silva',
    role: 'family',
  },
]

const COOKIE_NAME = 'access_token'

function getUserFromCookie(request: NextRequest) {
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value

  if (!cookieValue) {
    // TODO: Call real API when backend is ready
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    //   credentials: 'include',
    // })
    // return response.json()
    const mockUserId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID) || 0
    return mockUsers[mockUserId] ?? mockUsers[0]
  }

  const userId = Number(cookieValue)
  // TODO: Call real API when backend is ready
  // Instead of fetching from mockUsers array:
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
  //   credentials: 'include',
  // })
  // const user = await response.json()
  // return user
  const user = mockUsers.find((u) => u.id === userId)

  return user ?? mockUsers[0]
}

function isPublicRoute(pathname: string) {
  return pathname === '/' || pathname.startsWith('/login/')
}

function isFamilyRoute(pathname: string) {
  return pathname.startsWith('/family')
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const user = getUserFromCookie(request)
  const userRole = user?.role

  if (!user || !userRole) {
    const redirectUrl = isFamilyRoute(pathname) ? '/login/family' : '/login/clinic'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  if (pathname.startsWith('/login/')) {
    const destination = userRole === 'family' ? '/family/dashboard' : '/clinic/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
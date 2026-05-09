import { NextResponse, type NextRequest } from 'next/server'
import { authService } from '@/lib/authService'

function isPublicRoute(pathname: string) {
  return pathname.startsWith('/login/')
}

function isRootRoute(pathname: string) {
  return pathname === '/'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasCookie = request.cookies.has('access_token')

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (isRootRoute(pathname) && hasCookie) {
    try {
      const user = await authService.me()
      const destination = user.role === 'family' ? '/family/dashboard' : '/clinic/dashboard'
      return NextResponse.redirect(new URL(destination, request.url))
    } catch {
      return NextResponse.redirect(new URL('/login/clinic', request.url))
    }
  }

  if (isRootRoute(pathname)) {
    return NextResponse.redirect(new URL('/login/clinic', request.url))
  }

  if (pathname.startsWith('/login/')) {
    if (hasCookie) {
      return NextResponse.redirect(new URL('/family/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!hasCookie) {
    const isFamily = pathname.startsWith('/family')
    const loginPage = isFamily ? '/login/family' : '/login/clinic'
    return NextResponse.redirect(new URL(loginPage, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

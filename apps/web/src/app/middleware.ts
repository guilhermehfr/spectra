import { NextResponse, type NextRequest } from 'next/server'
import { authResolver } from '@/lib/authResolver'

async function getUserFromCookie(request: NextRequest) {
  const cookieValue = request.cookies.get(authResolver.getCookieName())?.value
  return authResolver.getUser(cookieValue)
}

function isPublicRoute(pathname: string) {
  return pathname === '/' || pathname.startsWith('/login/')
}

function isFamilyRoute(pathname: string) {
  return pathname.startsWith('/family')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const user = await getUserFromCookie(request)
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
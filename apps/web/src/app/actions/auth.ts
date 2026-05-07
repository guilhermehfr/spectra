'use server'

import { authService } from '@/lib/authService'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDashboardUrl, getLoginUrl } from '@/lib/utils/redirectUtils'
import type { UserRole } from '@/lib/types'

type LoginActionState = {
  email: string
  error?: string
}

export async function loginAction(
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get('email')?.toString().trim() || ''
  const password = formData.get('password')?.toString().trim() || ''

  if (!email || !password) {
    return {
      email,
      error: 'Digite seu email e senha para continuar',
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    return {
      email,
      error: 'Formato de email inválido',
    }
  }

  try {
    const response = await authService.login({ email, password })
    const { access, user } = response
    const { role } = user

    const cookieStore = await cookies()
    cookieStore.set('access_token', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    if (role === 'admin' || role === 'therapist' || role === 'family') {
      return redirect(getDashboardUrl(role))
    }

    return {
      email,
      error: 'Função de usuário desconhecida',
    }
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Login failed: ', error)

    return {
      email,
      error: 'Credenciais inválidas',
    }
  }
}

export async function logoutAction(): Promise<void> {
  let role: UserRole | null = null

  try {
    const user = await authService.me()
    role = user.role
  } catch (error) {
    console.error('Failed to get user during logout: ', error)
  }

  const cookieStore = await cookies()
  cookieStore.delete('access_token')

  const redirectTo = role ? getLoginUrl(role) : getLoginUrl('clinic')

  try {
    await authService.logout()
  } catch (error) {
    console.error('Logout action failed: ', error)
  }

  redirect(redirectTo)
}

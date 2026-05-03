'use server'

import { loginMock } from '@/lib/auth-mock'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
    const response = await loginMock(email, password)
    const { id, role } = response.user

    const cookieStore = await cookies()
    cookieStore.set('access_token', String(id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    switch (role) {
      case 'admin':
      case 'therapist':
        return redirect('/clinic/dashboard')
      case 'family':
        return redirect('/family/dashboard')
      default:
        return {
          email,
          error: 'Função de usuário desconhecida',
        }
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

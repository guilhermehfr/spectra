'use server'

import { loginMock, meMock } from '@/lib/auth-mock'
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
    await loginMock(email, password)
    const { id, role } = await meMock()
    console.log(id, role)

    if (!id) {
      return {
        email,
        error: 'Usuário não encontrado',
      }
    }

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

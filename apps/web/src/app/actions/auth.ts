'use server'

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

  return {
    email,
  }
}

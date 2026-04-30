'use server'

type LoginActionState = {
  username: string
  error: string
}

export async function loginAction(state: LoginActionState, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return {
      username: state.username,
      error: 'Invalid form data',
    }
  }

  const username = formData.get('username')?.toString().trim() || ''
  const password = formData.get('password')?.toString().trim() || ''

  if (!username || !password) {
    return {
      username,
      error: 'Type both username and password to login',
    }
  }

  return {
    ok: true,
    payload: {
      username,
      password,
    },
  }
}

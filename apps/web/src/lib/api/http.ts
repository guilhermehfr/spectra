export async function http<T>(
  input: string,
  options?: RequestInit & {
    timeout?: number
  }
): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(input)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  const url = isAbsolute ? input : `${baseUrl}${input}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options?.timeout ?? 10000)

  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options?.body && !(options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    })

    const contentType = res.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await res.json() : await res.text()

    if (!res.ok) {
      const message =
        typeof data === 'object' && data !== null && 'detail' in data
          ? (data as { detail: string }).detail
          : `HTTP ${res.status}`
      throw new Error(message)
    }

    return data as T
  } finally {
    clearTimeout(timeout)
  }
}

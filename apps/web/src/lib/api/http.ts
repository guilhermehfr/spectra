export async function http<T>(
  input: string,
  options?: RequestInit & {
    baseUrl?: string
    timeout?: number
    token?: string
  }
): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(input)
  const baseUrl = options?.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? ''
  const url = isAbsolute ? input : `${baseUrl}${input}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options?.timeout ?? 10000)

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options?.body && !(options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
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
          : `HTTP ${res.status} - ${url}`
      throw new Error(message)
    }

    return data as T
  } finally {
    clearTimeout(timeout)
  }
}

import { updateTag } from 'next/cache'

export async function http<T>(
  input: string,
  options?: RequestInit & {
    timeout?: number
    tag?: string
    tags?: string[]
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

  const cacheTags = options?.tags?.length
    ? options.tags
    : options?.tag
      ? [options.tag]
      : undefined

  const method = options?.method?.toUpperCase() || 'GET'
  const isReadOnly = method === 'GET' || method === 'HEAD'
  const cacheMode = isReadOnly ? 'force-cache' : 'no-store'
  const revalidateSeconds = isReadOnly ? 3600 : 0

  try {
    const res = await fetch(url, {
      ...options,
      cache: cacheMode,
      next: cacheTags ? { tags: cacheTags, revalidate: revalidateSeconds } : { revalidate: revalidateSeconds },
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
          : typeof data === 'object'
            ? JSON.stringify(data)
            : `HTTP ${res.status}`
      throw new Error(message)
    }

    return data as T
  } finally {
    clearTimeout(timeout)
  }
}

// Fine-grained tag revalidation functions
export function revalidatePatients() {
  updateTag('patients-list')
}

export function revalidatePatient(id: number) {
  updateTag(`patient-${id}`)
}

export function revalidateSessions() {
  updateTag('sessions-list')
}

export function revalidateSession(id: number) {
  updateTag(`session-${id}`)
}

export function revalidateEvolutions() {
  updateTag('evolutions-list')
}

export function revalidateEvolution(id: number) {
  updateTag(`evolution-${id}`)
}

export function revalidateFamilyEvolutions() {
  updateTag('family-evolutions')
}

export function revalidateDashboard() {
  updateTag('dashboard')
}

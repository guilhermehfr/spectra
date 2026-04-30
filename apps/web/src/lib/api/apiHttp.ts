import { http } from './http'

export const apiHttp = <T>(url: string, options?: RequestInit & { token?: string }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined')
  }

  return http<T>(url, {
    ...options,
    baseUrl,
    credentials: 'include',
  })
}

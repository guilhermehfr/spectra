import { cookies } from 'next/headers'
import { getMessages } from 'next-intl/server'
import type { Messages } from '@/lib/types'

async function loadMessages(): Promise<Messages> {
  try {
    return (await getMessages()) as unknown as Messages
  } catch {
    // next-intl request config unavailable — fallback to manual load
  }
  const store = await cookies()
  const locale = store.get('locale')?.value || 'en'
  return (
    await import(locale === 'pt-BR' ? '../../../messages/pt-BR.json' : '../../../messages/en.json')
  ).default
}

export async function getServerT() {
  const messages = await loadMessages()

  return (key: string, params?: Record<string, string | number>): string => {
    let value: Record<string, unknown> | string = messages
    for (const k of key.split('.')) {
      if (typeof value !== 'object' || value === null) return key
      value = value[k] as Record<string, unknown> | string
    }
    if (typeof value !== 'string') return key
    if (!params) return value
    return value.replace(/\{(\w+)\}/g, (_, p) => String(params[p] ?? `{${p}}`))
  }
}

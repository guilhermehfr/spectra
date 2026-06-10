export function getGreeting(
  firstName: string,
  t?: (key: string, params?: Record<string, string | number>) => string
): string {
  if (!firstName) return ''
  if (t) return t('hello', { name: firstName })
  return `Olá, ${firstName}`
}

export function formatDate(dateString: string, locale: string = 'pt-BR'): string {
  const date = new Date(dateString)
  return date
    .toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', '')
}

export function formatDateShort(dateString: string, locale: string = 'pt-BR'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateLong(dateString: string, locale: string = 'pt-BR'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(dateString: string, locale: string = 'pt-BR'): string {
  const date = new Date(dateString)
  return (
    date
      .toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace('.', '') + ' • 10:00'
  )
}

export function formatDateTimeISO(dateString: string, locale: string = 'pt-BR'): string {
  const [datePart, timePart] = dateString.split('T')
  if (timePart) {
    const [year, month, day] = datePart.split('-')
    const [hour, minute] = timePart.split(':')
    const separator = locale === 'en' ? 'at' : 'às'
    return `${day}/${month}/${year} ${separator} ${hour}:${minute}`
  }
  const [year, month, day] = datePart.split('-')
  return `${day}/${month}/${year}`
}

export function getRelativeDate(
  dateString: string | null,
  t?: (key: string, params?: Record<string, string | number>) => string
): string {
  if (!dateString) return t ? t('semSessoes') : 'Sem sessões'

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t ? t('hoje') : 'Hoje'
  if (diffDays === 1) return t ? t('ontem') : 'Ontem'
  if (diffDays === 2) return t ? t('ha2') : 'Há 2 dias'
  if (diffDays === 3) return t ? t('ha3') : 'Há 3 dias'
  if (diffDays === 4) return t ? t('ha4') : 'Há 4 dias'
  if (diffDays === 5) return t ? t('ha5') : 'Há 5 dias'
  if (diffDays === 6) return t ? t('ha6') : 'Há 6 dias'
  if (diffDays === 7) return t ? t('haUmaSemana') : 'Há uma semana'
  if (diffDays < 14) return t ? t('haDuasSemanas') : 'Há duas semanas'
  if (diffDays < 30)
    return t
      ? t('haNSemanas', { count: Math.floor(diffDays / 7) })
      : `Há ${Math.floor(diffDays / 7)} semanas`
  return t
    ? t('haNMeses', { count: Math.floor(diffDays / 30) })
    : `Há ${Math.floor(diffDays / 30)} meses`
}

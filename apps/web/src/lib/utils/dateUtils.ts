export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date
    .toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', '')
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateLong(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return (
    date
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace('.', '') + ' • 10:00'
  )
}

export function formatDateTimeISO(dateString: string): string {
  const [datePart, timePart] = dateString.split('T')
  if (timePart) {
    const [year, month, day] = datePart.split('-')
    const [hour, minute] = timePart.split(':')
    return `${day}/${month}/${year} às ${hour}:${minute}`
  }
  const [year, month, day] = datePart.split('-')
  return `${day}/${month}/${year}`
}

export function getRelativeDate(dateString: string | null): string {
  if (!dateString) return 'Sem sessões'

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays === 2) return 'Há 2 dias'
  if (diffDays === 3) return 'Há 3 dias'
  if (diffDays === 4) return 'Há 4 dias'
  if (diffDays === 5) return 'Há 5 dias'
  if (diffDays === 6) return 'Há 6 dias'
  if (diffDays === 7) return 'Há uma semana'
  if (diffDays < 14) return 'Há duas semanas'
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`
  return `Há ${Math.floor(diffDays / 30)} meses`
}

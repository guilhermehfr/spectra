export function getTodayRange(): { start: Date; end: Date } {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
  return { start, end }
}

export function getDaysAgo(days: number): Date {
  const today = new Date()
  return new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
}

type Session = { date_time: string }

const PT_DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const EN_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const LOCALE_DAY_LABELS: Record<string, string[]> = {
  'pt-BR': PT_DAY_LABELS,
  en: EN_DAY_LABELS,
}

export function aggregateByDayOfWeek(
  sessions: Session[],
  locale: string = 'pt-BR'
): { day: string; sessions: number }[] {
  const dayLabels = LOCALE_DAY_LABELS[locale] || PT_DAY_LABELS

  const dayMap: Record<string, number> = {}

  sessions.forEach((session) => {
    const date = new Date(session.date_time)
    const dayIndex = date.getDay()
    const dayLabel = dayLabels[dayIndex]
    dayMap[dayLabel] = (dayMap[dayLabel] || 0) + 1
  })

  return dayLabels.map((day) => ({
    day,
    sessions: dayMap[day] || 0,
  }))
}

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

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function aggregateByDayOfWeek(sessions: Session[]): { day: string; sessions: number }[] {
  const dayMap: Record<string, number> = {}

  sessions.forEach((session) => {
    const date = new Date(session.date_time)
    const dayIndex = date.getDay()
    const dayLabel = DAY_LABELS[dayIndex]
    dayMap[dayLabel] = (dayMap[dayLabel] || 0) + 1
  })

  return DAY_LABELS.map((day) => ({
    day,
    sessions: dayMap[day] || 0,
  }))
}

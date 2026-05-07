import type { Patient, Session, Evolution } from '@/lib/types'
import { getTodayRange, getDaysAgo } from './dateRangeUtils'

export interface ClinicStats {
  activePatients: number
  todaySessions: number
  pendingEvolutions: number
}

export function calculateClinicStats(
  patients: Patient[],
  sessions: Session[],
  evolutions: Evolution[]
): ClinicStats {
  const { start: startOfToday, end: endOfToday } = getTodayRange()

  const activePatients = patients.filter((p) => !p.is_deleted).length

  const todaySessions = sessions.filter((s) => {
    if (s.is_deleted) return false
    const sessionDate = new Date(s.date_time)
    return sessionDate >= startOfToday && sessionDate <= endOfToday
  }).length

  const completedSessionIds = new Set(
    sessions.filter((s) => s.status === 'completed' && !s.is_deleted).map((s) => s.id)
  )

  const pendingEvolutions = evolutions.filter((e) => {
    return !completedSessionIds.has(e.session) && !e.released_to_family
  }).length

  return { activePatients, todaySessions, pendingEvolutions }
}

export function filterRecentSessions(sessions: Session[], days: number) {
  const start = getDaysAgo(days)
  const today = new Date()

  return sessions.filter((s) => {
    if (s.is_deleted) return false
    const sessionDate = new Date(s.date_time)
    return sessionDate >= start && sessionDate <= today
  })
}

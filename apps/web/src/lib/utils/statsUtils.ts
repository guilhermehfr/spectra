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

  // Get IDs of completed sessions
  const completedSessionIds = new Set(
    sessions.filter((s) => s.status === 'completed' && !s.is_deleted).map((s) => s.id)
  )

  // Get IDs of sessions that already have evolutions
  const evolutionSessionIds = new Set((evolutions ?? []).map((e) => e.session))

  // Count sessions completed but without evolution
  const pendingEvolutions = [...completedSessionIds].filter(
    (sessionId) => !evolutionSessionIds.has(sessionId)
  ).length

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

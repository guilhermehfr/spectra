import type { Session, Evolution, User } from '@/lib/types'

export function canEditSession(session: Session, user: User): boolean {
  if (user.role === 'admin') return true
  return session.therapist === user.id
}

export function canDeleteSession(session: Session, user: User): boolean {
  if (user.role === 'admin') return true
  return session.therapist === user.id
}

export function canEditEvolution(
  evolution: Evolution,
  user: User,
  sessionTherapistId: number
): boolean {
  if (user.role === 'admin') return true
  return sessionTherapistId === user.id
}

export function canDeleteEvolution(
  evolution: Evolution,
  user: User,
  sessionTherapistId: number
): boolean {
  if (user.role === 'admin') return true
  return sessionTherapistId === user.id
}

export function canReleaseEvolution(
  evolution: Evolution,
  user: User,
  sessionTherapistId: number
): boolean {
  if (user.role === 'admin') return true
  return sessionTherapistId === user.id
}

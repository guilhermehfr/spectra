/**
 * Centralized Mock State Management
 *
 * This file holds the in-memory "database" for the entire mock system.
 * It's shared across auth, clinic, and family API layers, ensuring
 * consistent data across the application when NEXT_PUBLIC_DISABLE_MSW=false.
 *
 * When NEXT_PUBLIC_DISABLE_MSW=true, this state is not used and real HTTP
 * requests are made instead.
 */

import { mockUsers, mockTokens } from './data/users'
import { mockPatients } from './data/patients'
import { mockSessions } from './data/sessions'
import { mockEvolutions } from './data/evolutions'

import type { User, Patient, Session, Evolution } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Auth State
// ─────────────────────────────────────────────────────────────────────────────

let currentUser: User | null = null

export function setCurrentUser(user: User | null): void {
  currentUser = user
}

export function getCurrentUser(): User | null {
  return currentUser
}

export function clearCurrentUser(): void {
  currentUser = null
}

// ─────────────────────────────────────────────────────────────────────────────
// Database State
// ─────────────────────────────────────────────────────────────────────────────

const patients: Patient[] = [...mockPatients]
const sessions: Session[] = mockSessions as Session[]
const evolutions: Evolution[] = [...mockEvolutions]

let nextPatientId = Math.max(...patients.map((p) => p.id), 0) + 1
let nextSessionId = Math.max(...sessions.map((s) => s.id), 0) + 1
let nextEvolutionId = Math.max(...evolutions.map((e) => e.id), 0) + 1

// ─────────────────────────────────────────────────────────────────────────────
// Patient Operations
// ─────────────────────────────────────────────────────────────────────────────

export function getPatients(): Patient[] {
  return patients.filter((p) => !p.is_deleted)
}

export function getPatientById(id: number): Patient | undefined {
  return patients.find((p) => p.id === id && !p.is_deleted)
}

export function getPatientByGuardianEmail(email: string): Patient | null {
  return patients.find((p) => p.guardian_email === email && !p.is_deleted) || null
}

export function createPatient(
  data: Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>
): Patient {
  const now = new Date().toISOString()
  const newPatient: Patient = {
    ...data,
    id: nextPatientId++,
    created_at: now,
    updated_at: now,
    is_deleted: false,
  }
  patients.push(newPatient)
  return newPatient
}

export function updatePatient(id: number, data: Partial<Patient>): Patient | undefined {
  const index = patients.findIndex((p) => p.id === id && !p.is_deleted)
  if (index === -1) return undefined

  const now = new Date().toISOString()
  patients[index] = {
    ...patients[index],
    ...data,
    id: patients[index].id,
    created_at: patients[index].created_at,
    updated_at: now,
    is_deleted: patients[index].is_deleted,
  }
  return patients[index]
}

export function deletePatient(id: number): boolean {
  const index = patients.findIndex((p) => p.id === id)
  if (index === -1) return false
  patients[index].is_deleted = true
  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// Session Operations
// ─────────────────────────────────────────────────────────────────────────────

export function getSessions(): Session[] {
  return sessions.filter((s) => !s.is_deleted)
}

export function getSessionById(id: number): Session | undefined {
  return sessions.find((s) => s.id === id && !s.is_deleted)
}

export function createSession(
  data: Omit<
    Session,
    'id' | 'patient_name' | 'therapist_name' | 'is_deleted' | 'created_at' | 'updated_at'
  >
): Session {
  const now = new Date().toISOString()
  const patient = patients.find((p) => p.id === data.patient)
  const therapist = mockUsers.find((u) => u.id === data.therapist)

  const newSession: Session = {
    ...data,
    id: nextSessionId++,
    patient_name: patient?.name || '',
    therapist_name: therapist ? `${therapist.first_name} ${therapist.last_name}` : '',
    status: data.status || 'scheduled',
    notes: data.notes || '',
    is_deleted: false,
    created_at: now,
    updated_at: now,
  }
  sessions.push(newSession)
  return newSession
}

export function updateSession(id: number, data: Partial<Session>): Session | undefined {
  const index = sessions.findIndex((s) => s.id === id && !s.is_deleted)
  if (index === -1) return undefined

  const now = new Date().toISOString()
  sessions[index] = {
    ...sessions[index],
    ...data,
    id: sessions[index].id,
    patient_name: sessions[index].patient_name,
    therapist_name: sessions[index].therapist_name,
    is_deleted: sessions[index].is_deleted,
    created_at: sessions[index].created_at,
    updated_at: now,
  }
  return sessions[index]
}

export function deleteSession(id: number): boolean {
  const index = sessions.findIndex((s) => s.id === id)
  if (index === -1) return false
  sessions[index].is_deleted = true
  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// Evolution Operations
// ─────────────────────────────────────────────────────────────────────────────

export function getEvolutions(): Evolution[] {
  return evolutions
}

export function getEvolutionById(id: number): Evolution | undefined {
  return evolutions.find((e) => e.id === id)
}

export function getFamilyEvolutions(): Evolution[] {
  return evolutions.filter((e) => e.released_to_family)
}

export function createEvolution(
  data: Omit<Evolution, 'id' | 'created_at' | 'updated_at'>
): Evolution {
  const now = new Date().toISOString()

  // Validate session exists and is completed
  const session = sessions.find((s) => s.id === data.session)
  if (!session || session.status !== 'completed') {
    throw new Error('A sessão precisa estar com status completed.')
  }

  // Prevent duplicate evolution for same session
  if (evolutions.find((e) => e.session === data.session)) {
    throw new Error('Já existe uma evolução para esta sessão.')
  }

  const newEvolution: Evolution = {
    ...data,
    id: nextEvolutionId++,
    released_to_family: data.released_to_family ?? false,
    created_at: now,
    updated_at: now,
  }
  evolutions.push(newEvolution)
  return newEvolution
}

export function updateEvolution(id: number, data: Partial<Evolution>): Evolution | undefined {
  const index = evolutions.findIndex((e) => e.id === id)
  if (index === -1) return undefined

  const now = new Date().toISOString()
  evolutions[index] = {
    ...evolutions[index],
    ...data,
    id: evolutions[index].id,
    session: evolutions[index].session,
    created_at: evolutions[index].created_at,
    updated_at: now,
  }
  return evolutions[index]
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Metrics
// ─────────────────────────────────────────────────────────────────────────────

export function getDashboardMetrics() {
  const today = new Date().toISOString().split('T')[0]
  const todaySessions = sessions
    .filter((s) => !s.is_deleted && s.date_time.startsWith(today))
    .map((s) => ({
      id: s.id,
      patient: { id: s.patient, name: s.patient_name },
      therapist: { id: s.therapist, username: s.therapist_name },
      date_time: s.date_time,
      status: s.status,
      notes: s.notes,
    }))

  const activePatients = patients.filter((p) => !p.is_deleted).length

  const completedSessionIds = sessions.filter((s) => s.status === 'completed').map((s) => s.id)

  const evolutionSessionIds = evolutions.map((e) => e.session)

  const pendingEvolutions = completedSessionIds.filter(
    (id) => !evolutionSessionIds.includes(id)
  ).length

  return {
    today_sessions: todaySessions,
    active_patients: activePatients,
    pending_evolutions: pendingEvolutions,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Data
// ─────────────────────────────────────────────────────────────────────────────

export function getMockUsers() {
  return mockUsers
}

export function getMockTokens() {
  return mockTokens
}

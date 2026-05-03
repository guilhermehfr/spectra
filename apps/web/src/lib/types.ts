export type UserRole = 'admin' | 'therapist' | 'family'

export type User = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  phone: string
  is_active: boolean
}

export type AuthResponse = {
  access: string
  refresh: string
  user: User
}

export type LoginCredentials = {
  email: string
  password: string
}

export type UserBasicInfo = Pick<User, 'id' | 'role' | 'email' | 'username'>

export type Patient = {
  id: number
  name: string
  birth_date: string
  guardian_name: string
  guardian_email: string
  notes: string
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export type CreatePatientInput = Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>
export type UpdatePatientInput = Partial<CreatePatientInput>

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export type Session = {
  id: number
  patient: number
  patient_name: string
  therapist: number
  therapist_name: string
  date_time: string
  status: SessionStatus
  notes: string
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export type CreateSessionInput = {
  patient: number
  therapist: number
  date_time: string
  status?: SessionStatus
  notes?: string
}

export type UpdateSessionInput = Partial<CreateSessionInput>

export type Evolution = {
  id: number
  session: number
  session_date: string
  therapist_name: string
  objective: string
  activities: string
  behavior: string
  progress: string
  next_steps: string
  released_to_family: boolean
  created_at: string
  updated_at: string
}

export type CreateEvolutionInput = {
  session: number
  objective: string
  activities: string
  behavior: string
  progress: string
  next_steps: string
  released_to_family?: boolean
}

export type UpdateEvolutionInput = Partial<Omit<CreateEvolutionInput, 'session'>>

export type Dashboard = {
  today_sessions: Session[]
  active_patients: number
  pending_evolutions: number
}

export type FamilyEvolution = Pick<
  Evolution,
  | 'id'
  | 'session'
  | 'session_date'
  | 'therapist_name'
  | 'objective'
  | 'activities'
  | 'behavior'
  | 'progress'
  | 'next_steps'
  | 'created_at'
>

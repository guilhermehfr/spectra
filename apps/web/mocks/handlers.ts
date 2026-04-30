import { http, HttpResponse } from "msw"

import { mockUsers, mockTokens } from "./data/users"
import { mockPatients } from "./data/patients"
import { mockSessions } from "./data/sessions"
import { mockEvolutions } from "./data/evolutions"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

// ─────────────────────────────────────────────────────────────────────────────
// In-Memory State (for development)
// ─────────────────────────────────────────────────────────────────────────────

const patients = [...mockPatients]
const sessions = [...mockSessions]
const evolutions = [...mockEvolutions]

let nextPatientId = patients.length + 1
let nextSessionId = sessions.length + 1
let nextEvolutionId = evolutions.length + 1

// ─────────────────────────────────────────────────────────────────────────────
// MSW Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const handlers = [
  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * POST /api/auth/login/
   * Authenticates user and returns access/refresh tokens
   */
  http.post(`${BASE_URL}/api/auth/login/`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    const user = mockUsers.find((u) => u.email === body.email)

    if (!user) {
      return HttpResponse.json(
        { detail: "Email não encontrado." },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      access: mockTokens.access,
      refresh: mockTokens.refresh,
      user,
    })
  }),

  /**
   * POST /api/auth/refresh/
   * Refreshes authentication token
   */
  http.post(`${BASE_URL}/api/auth/refresh/`, () => {
    return HttpResponse.json({ access: mockTokens.access })
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/
   * Lists all active patients (non-deleted)
   */
  http.get(`${BASE_URL}/api/patients/`, () => {
    return HttpResponse.json(patients.filter((p) => !p.is_deleted))
  }),

  /**
   * POST /api/patients/
   * Creates a new patient
   */
  http.post(`${BASE_URL}/api/patients/`, async ({ request }) => {
    const body = (await request.json()) as typeof mockPatients[0]
    const newPatient = {
      ...body,
      id: nextPatientId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    }
    patients.push(newPatient)
    return HttpResponse.json(newPatient, { status: 201 })
  }),

  /**
   * GET /api/patients/:id/
   * Retrieves a specific patient by ID
   */
  http.get(`${BASE_URL}/api/patients/:id/`, ({ params }) => {
    const patient = patients.find(
      (p) => p.id === Number(params.id) && !p.is_deleted
    )
    if (!patient) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }
    return HttpResponse.json(patient)
  }),

  /**
   * PUT /api/patients/:id/
   * Updates an existing patient
   */
  http.put(`${BASE_URL}/api/patients/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<typeof mockPatients[0]>
    const index = patients.findIndex((p) => p.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }

    patients[index] = {
      ...patients[index],
      ...body,
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(patients[index])
  }),

  /**
   * DELETE /api/patients/:id/
   * Soft-deletes a patient (marks as deleted)
   */
  http.delete(`${BASE_URL}/api/patients/:id/`, ({ params }) => {
    const index = patients.findIndex((p) => p.id === Number(params.id))
    if (index === -1) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }
    patients[index].is_deleted = true
    return new HttpResponse(null, { status: 204 })
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/sessions/
   * Lists all active sessions (non-deleted)
   */
  http.get(`${BASE_URL}/api/sessions/`, () => {
    return HttpResponse.json(sessions.filter((s) => !s.is_deleted))
  }),

  /**
   * POST /api/sessions/
   * Creates a new therapy session
   */
  http.post(`${BASE_URL}/api/sessions/`, async ({ request }) => {
    const body = (await request.json()) as typeof mockSessions[0]
    const patient = patients.find((p) => p.id === body.patient)
    const therapist = mockUsers.find((u) => u.id === body.therapist)

    const newSession = {
      ...body,
      id: nextSessionId++,
      patient_name: patient?.name || "",
      therapist_name: therapist
        ? `${therapist.first_name} ${therapist.last_name}`
        : "",
      status: "scheduled",
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    sessions.push(newSession)
    return HttpResponse.json(newSession, { status: 201 })
  }),

  /**
   * GET /api/sessions/:id/
   * Retrieves a specific session by ID
   */
  http.get(`${BASE_URL}/api/sessions/:id/`, ({ params }) => {
    const session = sessions.find(
      (s) => s.id === Number(params.id) && !s.is_deleted
    )
    if (!session) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }
    return HttpResponse.json(session)
  }),

  /**
   * PUT /api/sessions/:id/
   * Updates an existing session
   */
  http.put(`${BASE_URL}/api/sessions/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<typeof mockSessions[0]>
    const index = sessions.findIndex((s) => s.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }

    sessions[index] = {
      ...sessions[index],
      ...body,
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(sessions[index])
  }),

  /**
   * DELETE /api/sessions/:id/
   * Soft-deletes a session (marks as deleted)
   */
  http.delete(`${BASE_URL}/api/sessions/:id/`, ({ params }) => {
    const index = sessions.findIndex((s) => s.id === Number(params.id))
    if (index === -1) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }
    sessions[index].is_deleted = true
    return new HttpResponse(null, { status: 204 })
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // EVOLUTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * POST /api/evolutions/
   * Creates a new evolution (therapy notes) for a completed session
   * Requirements:
   * - Session must exist and have status "completed"
   * - Only one evolution per session
   */
  http.post(`${BASE_URL}/api/evolutions/`, async ({ request }) => {
    const body = (await request.json()) as typeof mockEvolutions[0]
    const session = sessions.find((s) => s.id === body.session)

    if (!session || session.status !== "completed") {
      return HttpResponse.json(
        { detail: "A sessão precisa estar com status completed." },
        { status: 400 }
      )
    }

    const alreadyExists = evolutions.find((e) => e.session === body.session)
    if (alreadyExists) {
      return HttpResponse.json(
        { detail: "Já existe uma evolução para esta sessão." },
        { status: 400 }
      )
    }

    const newEvolution = {
      ...body,
      id: nextEvolutionId++,
      released_to_family: body.released_to_family ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    evolutions.push(newEvolution)
    return HttpResponse.json(newEvolution, { status: 201 })
  }),

  /**
   * GET /api/evolutions/:id/
   * Retrieves a specific evolution by ID
   */
  http.get(`${BASE_URL}/api/evolutions/:id/`, ({ params }) => {
    const evolution = evolutions.find((e) => e.id === Number(params.id))
    if (!evolution) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }
    return HttpResponse.json(evolution)
  }),

  /**
   * PUT /api/evolutions/:id/
   * Updates an existing evolution
   */
  http.put(`${BASE_URL}/api/evolutions/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<typeof mockEvolutions[0]>
    const index = evolutions.findIndex((e) => e.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json(
        { detail: "Não encontrado." },
        { status: 404 }
      )
    }

    evolutions[index] = {
      ...evolutions[index],
      ...body,
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(evolutions[index])
  }),

  /**
   * GET /api/evolutions/
   * Lists all evolutions
   */
  http.get(`${BASE_URL}/api/evolutions/`, () => {
    return HttpResponse.json(evolutions)
  }),

  /**
   * GET /api/evolutions/family/
   * Lists all evolutions released to family members
   */
  http.get(`${BASE_URL}/api/evolutions/family/`, () => {
    const familyEvolutions = evolutions.filter((e) => e.released_to_family)
    return HttpResponse.json(familyEvolutions)
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/dashboard/
   * Provides dashboard metrics:
   * - today_sessions: Sessions scheduled for today
   * - active_patients: Count of non-deleted patients
   * - pending_evolutions: Count of completed sessions without evolution notes
   */
  http.get(`${BASE_URL}/api/dashboard/`, () => {
    const today = new Date().toISOString().split("T")[0]

    const todaySessions = sessions.filter(
      (s) => !s.is_deleted && s.date_time.startsWith(today)
    )

    const activePatients = patients.filter((p) => !p.is_deleted).length

    const completedSessionIds = sessions
      .filter((s) => s.status === "completed")
      .map((s) => s.id)

    const evolutionSessionIds = evolutions.map((e) => e.session)

    const pendingEvolutions = completedSessionIds.filter(
      (id) => !evolutionSessionIds.includes(id)
    ).length

    return HttpResponse.json({
      today_sessions: todaySessions,
      active_patients: activePatients,
      pending_evolutions: pendingEvolutions,
    })
  }),
]

import { http, HttpResponse } from 'msw'

import { mockUsers as users, mockTokens as tokens } from './data/users'
import * as state from './state'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

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
    const user = users.find((u) => u.email === body.email)

    if (!user) {
      return HttpResponse.json({ detail: 'Email não encontrado.' }, { status: 400 })
    }

    return HttpResponse.json({
      access: tokens.access,
      refresh: tokens.refresh,
      user,
    })
  }),

  /**
   * POST /api/auth/refresh/
   * Refreshes authentication token
   */
  http.post(`${BASE_URL}/api/auth/refresh/`, () => {
    return HttpResponse.json({ access: tokens.access })
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/
   * Lists all active patients (non-deleted)
   */
  http.get(`${BASE_URL}/api/patients/`, () => {
    return HttpResponse.json(state.getPatients())
  }),

  /**
   * POST /api/patients/
   * Creates a new patient
   */
  http.post(`${BASE_URL}/api/patients/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    try {
      const newPatient = state.createPatient(body as Parameters<typeof state.createPatient>[0])
      return HttpResponse.json(newPatient, { status: 201 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating patient'
      return HttpResponse.json({ detail: message }, { status: 400 })
    }
  }),

  /**
   * GET /api/patients/:id/
   * Retrieves a specific patient by ID
   */
  http.get(`${BASE_URL}/api/patients/:id/`, ({ params }) => {
    const patient = state.getPatientById(Number(params.id))
    if (!patient) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }
    return HttpResponse.json(patient)
  }),

  /**
   * PUT /api/patients/:id/
   * Updates an existing patient
   */
  http.put(`${BASE_URL}/api/patients/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const updated = state.updatePatient(
      Number(params.id),
      body as Parameters<typeof state.updatePatient>[1]
    )

    if (!updated) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  /**
   * DELETE /api/patients/:id/
   * Soft-deletes a patient (marks as deleted)
   */
  http.delete(`${BASE_URL}/api/patients/:id/`, ({ params }) => {
    const deleted = state.deletePatient(Number(params.id))
    if (!deleted) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }
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
    return HttpResponse.json(state.getSessions())
  }),

  /**
   * POST /api/sessions/
   * Creates a new therapy session
   */
  http.post(`${BASE_URL}/api/sessions/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    try {
      const newSession = state.createSession(body as Parameters<typeof state.createSession>[0])
      return HttpResponse.json(newSession, { status: 201 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating session'
      return HttpResponse.json({ detail: message }, { status: 400 })
    }
  }),

  /**
   * GET /api/sessions/:id/
   * Retrieves a specific session by ID
   */
  http.get(`${BASE_URL}/api/sessions/:id/`, ({ params }) => {
    const session = state.getSessionById(Number(params.id))
    if (!session) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }
    return HttpResponse.json(session)
  }),

  /**
   * PUT /api/sessions/:id/
   * Updates an existing session
   */
  http.put(`${BASE_URL}/api/sessions/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const updated = state.updateSession(
      Number(params.id),
      body as Parameters<typeof state.updateSession>[1]
    )

    if (!updated) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  /**
   * DELETE /api/sessions/:id/
   * Soft-deletes a session (marks as deleted)
   */
  http.delete(`${BASE_URL}/api/sessions/:id/`, ({ params }) => {
    const deleted = state.deleteSession(Number(params.id))
    if (!deleted) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }
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
    const body = (await request.json()) as Record<string, unknown>
    try {
      const newEvolution = state.createEvolution(
        body as Parameters<typeof state.createEvolution>[0]
      )
      return HttpResponse.json(newEvolution, { status: 201 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating evolution'
      return HttpResponse.json({ detail: message }, { status: 400 })
    }
  }),

  /**
   * GET /api/evolutions/:id/
   * Retrieves a specific evolution by ID
   */
  http.get(`${BASE_URL}/api/evolutions/:id/`, ({ params }) => {
    const evolution = state.getEvolutionById(Number(params.id))
    if (!evolution) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }
    return HttpResponse.json(evolution)
  }),

  /**
   * PUT /api/evolutions/:id/
   * Updates an existing evolution
   */
  http.put(`${BASE_URL}/api/evolutions/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const updated = state.updateEvolution(
      Number(params.id),
      body as Parameters<typeof state.updateEvolution>[1]
    )

    if (!updated) {
      return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  /**
   * GET /api/evolutions/
   * Lists all evolutions
   */
  http.get(`${BASE_URL}/api/evolutions/`, () => {
    return HttpResponse.json(state.getEvolutions())
  }),

  /**
   * GET /api/evolutions/family/
   * Lists all evolutions released to family members
   */
  http.get(`${BASE_URL}/api/evolutions/family/`, () => {
    return HttpResponse.json(state.getFamilyEvolutions())
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
    return HttpResponse.json(state.getDashboardMetrics())
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // THERAPISTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/therapists/
   * Lists all therapists (users with role 'therapist')
   */
  http.get(`${BASE_URL}/api/therapists/`, () => {
    return HttpResponse.json(state.getTherapists())
  }),
]

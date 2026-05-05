# Spectra Web App Frontend - Authentication & Mock Data Implementation Summary

## Overview

The Spectra web app frontend uses a sophisticated multi-layered architecture for authentication and API mocking that allows seamless switching between mock and real implementations via environment variables.

---

## 1. Authentication Mocking Setup

### 1.1 Auth Environment-Based Switching

**Location**: `src/lib/authService.ts`

```typescript
export const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

export const authService = useMock
  ? { login: loginMock, me: meMock, logout: logoutMock }
  : { login: loginReal, me: meReal, logout: logoutReal }
```

- **Default (Dev)**: `NEXT_PUBLIC_DISABLE_MSW=false` → Uses mock implementation
- **Production**: `NEXT_PUBLIC_DISABLE_MSW=true` → Uses real HTTP API calls

### 1.2 Mock Authentication Implementation

**Location**: `src/lib/auth-mock.ts`

**Functions**:

- `loginMock(email, password)`:
  - Finds user by email in `mockUsers` array
  - Stores user in centralized mock state via `mockState.setCurrentUser()`
  - Returns mock tokens and user object
  - Password is ignored (any password works)

- `meMock()`:
  - Returns current user from mock state or defaults to `NEXT_PUBLIC_MOCK_USER_ID`
  - Returns `UserBasicInfo` (id, email, username, role)

- `logoutMock()`:
  - Clears current user from mock state via `mockState.clearCurrentUser()`

### 1.3 Real Authentication Implementation

**Location**: `src/lib/auth.ts`

- `login()`: HTTP POST to `/api/auth/login/`
- `me()`: HTTP GET to `/api/auth/me/`
- `logout()`: HTTP POST to `/api/auth/logout/`

Uses generic `http<T>()` client with JSON/error handling.

### 1.4 Auth Resolver (Token/Cookie Handling)

**Location**: `src/lib/authResolver.ts`

```typescript
export const authResolver = {
  getUser: async (cookieValue?: string): Promise<UserBasicInfo | null> => {
    // If no cookie:
    // - Mock mode: return NEXT_PUBLIC_MOCK_USER_ID user
    // - Real mode: return null
    // If cookie exists: parse as userId number
    // - Mock mode: resolve from mockUsers array
    // - Real mode: call authService.me()
  },
}
```

**Flow**:

1. Middleware reads `access_token` cookie
2. Cookie value is passed to `authResolver.getUser()`
3. In mock mode: cookie = userId (e.g., "1") → resolved to mockUsers[1]
4. In real mode: cookie = actual token → call backend `/api/auth/me/`

### 1.5 Authentication Flow Diagram

```
LOGIN PAGE
    ↓
authService.login(email, password)
    ↓
    ├─ MOCK: loginMock() → finds in mockUsers → stores in mockState → returns tokens
    └─ REAL: HTTP POST /api/auth/login/
    ↓
SERVER ACTION stores userId in `access_token` cookie
    ↓
REDIRECT to /clinic/dashboard or /family/dashboard
    ↓
MIDDLEWARE checks access_token cookie
    ↓
authResolver.getUser(cookieValue) retrieves user info
    ↓
PAGE COMPONENT renders authenticated content
```

### 1.6 MSW Integration

**Location**: `instrumentation-client.ts` & `src/mocks/browser.ts`

```typescript
// instrumentation-client.ts - runs on app startup
export async function register() {
  if (process.env.NODE_ENV !== 'development') return
  if (process.env.NEXT_PUBLIC_DISABLE_MSW === 'true') return

  if (typeof window !== 'undefined') {
    const { worker } = await import('./src/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

**Activation**:

- Only in `NODE_ENV=development`
- Only if `NEXT_PUBLIC_DISABLE_MSW !== 'true'`
- Intercepts fetch calls in browser matching handler patterns
- `onUnhandledRequest: 'bypass'` = requests not in handlers pass through

---

## 2. Mock Data Structure

### 2.1 Centralized Mock State

**Location**: `src/mocks/state.ts`

**Responsibilities**:

- Holds in-memory "database" for users, patients, sessions, evolutions
- Implements CRUD operations with validation
- Maintains auto-incrementing IDs
- Handles soft-deletes via `is_deleted` flag

**Key Functions**:

```typescript
// Auth
setCurrentUser(user) // Store logged-in user
getCurrentUser() // Retrieve logged-in user
clearCurrentUser() // Logout (clear user)

// Patients
getPatients() // All non-deleted
getPatientById(id)
getPatientByGuardianEmail(email) // For family portal
createPatient(data)
updatePatient(id, data)
deletePatient(id) // Soft-delete

// Sessions
getSessions()
getSessionById(id)
createSession(data) // Auto-populates patient_name, therapist_name
updateSession(id, data)
deleteSession(id)

// Evolutions
getEvolutions()
getEvolutionById(id)
getFamilyEvolutions() // Only released_to_family=true
createEvolution(data) // Validates session.status='completed'
updateEvolution(id, data)

// Dashboard
getDashboardMetrics() // today_sessions, active_patients, pending_evolutions
```

### 2.2 Mock Data Files

#### users.ts

```typescript
mockUsers = [
  { id: 1, username: 'admin', email: 'admin@spectra.com', role: 'admin', ... },
  { id: 2, username: 'terapeuta1', email: 'ana@spectra.com', role: 'therapist', ... },
  { id: 3, username: 'terapeuta2', email: 'carlos@spectra.com', role: 'therapist', ... },
  { id: 4, username: 'familia1', email: 'maria@gmail.com', role: 'family', ... },
]

mockTokens = {
  access: 'mock-access-token-xyz',
  refresh: 'mock-refresh-token-xyz',
}
```

#### patients.ts

```typescript
mockPatients = [
  {
    id: 1,
    name: 'Leonardo Silva',
    birth_date: '2017-03-10',
    guardian_name: 'Maria Silva',
    guardian_email: 'maria@gmail.com', // Linked to family user
    notes: 'Diagnóstico de TEA grau 1...',
    is_deleted: false,
  },
  // 4 patients total
]
```

#### sessions.ts

```typescript
mockSessions = [
  {
    id: 1,
    patient: 1, // ID reference
    patient_name: 'Leonardo Silva', // Denormalized
    therapist: 2, // ID reference
    therapist_name: 'Ana Lima', // Denormalized
    date_time: '2026-04-29T09:00:00Z',
    status: 'completed' | 'scheduled' | 'cancelled',
    notes: '...',
    is_deleted: false,
  },
  // 5 sessions total
]
```

#### evolutions.ts

```typescript
mockEvolutions = [
  {
    id: 1,
    session: 1, // Links to session (which links to patient)
    therapist_name: 'Ana Lima',
    session_date: '2026-04-29T09:00:00Z',
    objective: 'Aumentar tempo de atenção...',
    activities: 'Brincadeira com blocos...',
    behavior: 'Tranquilo e focado...',
    progress: 'Ótimo avanço...',
    next_steps: 'Introduzir atividade...',
    released_to_family: true, // Controls visibility to family
  },
  // 1 evolution (connected to session 1)
]
```

### 2.3 Mock Data Relationships

```
mockUsers (id=4)
  ↓ guardian_email
  └─ mockPatients (id=1, guardian_email='maria@gmail.com')
       ↓ patient (id=1)
       └─ mockSessions (id=1, patient=1)
            ↓ session (id=1)
            └─ mockEvolutions (id=1, session=1, released_to_family=true)
```

**Key Pattern**: Family user can see evolutions for their patient because:

1. Family email = guardian_email of patient
2. Evolution is related to patient via session
3. Evolution has `released_to_family: true`

---

## 3. MSW Handlers

**Location**: `src/mocks/handlers.ts`

### 3.1 Handler Pattern

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export const handlers = [
  http.get(`${BASE_URL}/api/patients/`, () => {
    return HttpResponse.json(state.getPatients())
  }),

  http.post(`${BASE_URL}/api/patients/`, async ({ request }) => {
    const body = await request.json()
    const newPatient = state.createPatient(body)
    return HttpResponse.json(newPatient, { status: 201 })
  }),
]
```

### 3.2 Handlers Overview

| Method | Path                    | Handler                  | State Function        | Notes                                            |
| ------ | ----------------------- | ------------------------ | --------------------- | ------------------------------------------------ |
| POST   | /api/auth/login/        | Returns tokens + user    | -                     | No state mutation                                |
| POST   | /api/auth/refresh/      | Returns new access token | -                     | -                                                |
| GET    | /api/patients/          | Lists all active         | getPatients()         | -                                                |
| POST   | /api/patients/          | Creates patient          | createPatient()       | Status 201                                       |
| GET    | /api/patients/:id/      | Get by ID                | getPatientById()      | 404 if not found                                 |
| PUT    | /api/patients/:id/      | Updates patient          | updatePatient()       | -                                                |
| DELETE | /api/patients/:id/      | Soft-deletes             | deletePatient()       | Status 204                                       |
| GET    | /api/sessions/          | Lists all active         | getSessions()         | -                                                |
| POST   | /api/sessions/          | Creates session          | createSession()       | Status 201                                       |
| GET    | /api/sessions/:id/      | Get by ID                | getSessionById()      | -                                                |
| PUT    | /api/sessions/:id/      | Updates session          | updateSession()       | -                                                |
| DELETE | /api/sessions/:id/      | Soft-deletes             | deleteSession()       | Status 204                                       |
| POST   | /api/evolutions/        | Creates evolution        | createEvolution()     | Validates: session completed, unique per session |
| GET    | /api/evolutions/:id/    | Get by ID                | getEvolutionById()    | -                                                |
| PUT    | /api/evolutions/:id/    | Updates evolution        | updateEvolution()     | -                                                |
| GET    | /api/evolutions/        | Lists all                | getEvolutions()       | -                                                |
| GET    | /api/evolutions/family/ | Released to family       | getFamilyEvolutions() | Filters: released_to_family=true                 |
| GET    | /api/dashboard/         | Dashboard metrics        | getDashboardMetrics() | Returns stats object                             |

### 3.3 Error Handling

```typescript
// Missing resource
return HttpResponse.json({ detail: 'Não encontrado.' }, { status: 404 })

// Invalid operation
return HttpResponse.json(
  { detail: 'A sessão precisa estar com status completed.' },
  { status: 400 }
)

// Empty response
return new HttpResponse(null, { status: 204 })
```

---

## 4. API Call Patterns

### 4.1 Lazy-Load Dispatcher Pattern

**Location**: `src/lib/api/clinic.ts` and `src/lib/api/family.ts`

```typescript
const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

const getImpl = async () => {
  if (useMock) {
    return import('@/lib/api/clinic-mock') // No HTTP calls
  } else {
    return import('@/lib/api/clinic-real') // Makes HTTP calls
  }
}

export async function getPatients() {
  const impl = await getImpl()
  return impl.getPatients()
}
```

**Benefits**:

- Avoids circular dependencies
- Only loads necessary code (mock or real)
- Single source of truth for function signatures

### 4.2 Mock Implementation Pattern

**Location**: `src/lib/api/clinic-mock.ts`

```typescript
export function getPatients(): Promise<Patient[]> {
  return Promise.resolve(state.getPatients())
}

export async function getPatientByGuardianEmail(email: string): Promise<Patient | null> {
  return Promise.resolve(state.getPatientByGuardianEmail(email))
}

export function createEvolution(data: CreateEvolutionInput): Promise<Evolution> {
  try {
    // Validate: get session and check status='completed'
    const session = state.getSessionById(data.session)
    if (!session || session.status !== 'completed') {
      throw new Error('A sessão precisa estar com status completed.')
    }

    // Build evolution with denormalized fields
    const evolutionData = {
      session: data.session,
      session_date: session.date_time,
      therapist_name: session.therapist_name,
      // ... rest of fields
    }

    const result = state.createEvolution(evolutionData)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.reject(error)
  }
}
```

**Pattern**:

1. Wraps all calls in Promise (even though synchronous) for consistent async interface
2. Performs business logic validation
3. Denormalizes data where needed (e.g., session_date → from session.date_time)
4. Returns same types as real implementation

### 4.3 Real Implementation Pattern

**Location**: `src/lib/api/clinic-real.ts`

```typescript
export function getPatients() {
  return http<Patient[]>('/api/patients/')
}

export async function getPatientByGuardianEmail(email: string) {
  const patients = await getPatients()
  return patients.find((p) => p.guardian_email === email) || null
}

export function createEvolution(data: CreateEvolutionInput) {
  return http<Evolution>('/api/evolutions/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
```

**Pattern**:

1. Calls `http<T>(path, options)` generic client
2. Client handles JSON serialization, error handling, timeouts
3. For filtered searches (like `getPatientByGuardianEmail`), fetches all and filters client-side

### 4.4 HTTP Client

**Location**: `src/lib/api/http.ts`

```typescript
export async function http<T>(
  input: string,
  options?: RequestInit & { timeout?: number }
): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(input)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  const url = isAbsolute ? input : `${baseUrl}${input}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options?.timeout ?? 10000)

  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include', // Send cookies
      headers: {
        ...(options?.body && !(options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    })

    const contentType = res.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await res.json() : await res.text()

    if (!res.ok) {
      const message =
        typeof data === 'object' && 'detail' in data ? data.detail : `HTTP ${res.status}`
      throw new Error(message)
    }

    return data as T
  } finally {
    clearTimeout(timeout)
  }
}
```

**Features**:

- Resolves relative URLs against `NEXT_PUBLIC_API_URL`
- Default timeout: 10 seconds (configurable)
- Automatic Content-Type header for JSON
- Includes credentials (cookies)
- Extracts error message from response `detail` field
- AbortController for timeout handling

---

## 5. Family Dashboard Data Flow

**Location**: `src/app/family/dashboard/page.tsx`

### 5.1 Complete Flow

```typescript
// Page: async Server Component (dynamic = 'force-dynamic')
export default async function FamilyDashboard() {
  // 1. Get auth cookie
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get('access_token')?.value

  // 2. Resolve user from cookie
  const user = await authResolver.getUser(cookieValue)

  // 3. Get patient by matching family email to guardian_email
  let patient = await getPatientByGuardianEmail(user.email)

  // 4. Fetch all evolutions (filtered to released_to_family by API)
  let evolutions = await getFamilyEvolutions()

  // 5. Compute display data
  const latestEvolution = evolutions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0]

  // 6. Render UI with stats, avatar, evolution card
}
```

### 5.2 Data Resolution Steps

```
access_token cookie (value: "4")
    ↓
authResolver.getUser("4")
    ↓
    ├─ MOCK: mockUsers.find(u => u.id === 4) → Maria Silva (family)
    └─ REAL: HTTP GET /api/auth/me/
    ↓
user = { id: 4, email: 'maria@gmail.com', role: 'family', ... }
    ↓
getPatientByGuardianEmail('maria@gmail.com')
    ↓
    ├─ MOCK: state.getPatientByGuardianEmail('maria@gmail.com')
    └─ REAL: HTTP GET /api/patients/ → find by guardian_email
    ↓
patient = { id: 1, name: 'Leonardo Silva', guardian_email: 'maria@gmail.com', ... }
    ↓
getFamilyEvolutions()
    ↓
    ├─ MOCK: state.getFamilyEvolutions() (filters released_to_family=true)
    └─ REAL: HTTP GET /api/evolutions/family/
    ↓
evolutions = [
  {
    id: 1,
    session: 1,
    session_date: '2026-04-29T09:00:00Z',
    therapist_name: 'Ana Lima',
    objective: '...',
    activities: '...',
    behavior: '...',
    progress: '...',
    next_steps: '...',
    created_at: '2026-04-29T10:30:00Z',
  }
]
    ↓
Display:
- Avatar: Patient initials (LS) in blue gradient
- Stats: Total sessions (1), Last session (relative: "Hoje")
- Evolution Card: Latest evolution with therapist name, objective, etc.
```

### 5.3 Dashboard Stats Component

**Location**: `src/components/ui/family/FamilyDashboardStats.tsx`

```typescript
<FamilyDashboardStats
  totalSessions={evolutions.length}
  lastSession={lastSessionRelative}
/>
```

**Displays**:

- "Total de Sessões": Count of evolutions
- "Última Sessão": Relative date (Hoje, Ontem, Há X dias, etc.)

### 5.4 Latest Evolution Card

**Location**: `src/components/ui/family/LatestEvolutionCard.tsx`

```typescript
<LatestEvolutionCard evolution={latestEvolution} />
```

**Displays**:

- Therapist name: "Terapeuta. [Ana Lima]"
- Objective, Activities, Behavior, Progress, Next Steps
- Styled white card on light blue background

---

## 6. Current Mock Data Coverage

### 6.1 What's Mocked

✅ **Authentication**

- Login (any email from mockUsers, any password)
- Current user retrieval
- Logout

✅ **Patients**

- CRUD operations
- Query by guardian email
- Soft-delete support

✅ **Sessions**

- CRUD operations
- Auto-population of denormalized fields (patient_name, therapist_name)
- Status tracking (scheduled, completed, cancelled)

✅ **Evolutions**

- Create (validates session status = completed)
- Read by ID
- Update
- List all
- Filter by released_to_family flag

✅ **Dashboard**

- Today's sessions count
- Active patients count
- Pending evolutions count

### 6.2 Current Mock Data Scale

| Entity     | Count | Current State                                     |
| ---------- | ----- | ------------------------------------------------- |
| Users      | 4     | 1 admin, 2 therapists, 1 family                   |
| Patients   | 4     | All active (is_deleted: false)                    |
| Sessions   | 5     | Mix of statuses (completed, scheduled, cancelled) |
| Evolutions | 1     | Related to session 1, released_to_family: true    |

### 6.3 Test User Credentials

| Email              | Role      | Password | Patient        | Notes                             |
| ------------------ | --------- | -------- | -------------- | --------------------------------- |
| admin@spectra.com  | admin     | any      | -              | Clinic portal access              |
| ana@spectra.com    | therapist | any      | -              | Therapist (created session 1, 2)  |
| carlos@spectra.com | therapist | any      | -              | Therapist (created sessions 3, 4) |
| maria@gmail.com    | family    | any      | Leonardo Silva | Family portal access              |

---

## 7. Architecture Decisions & Patterns

### 7.1 Lazy-Load Dispatchers

**Why?**

- Avoids circular dependencies between mock/real/dispatcher
- Only loads code path actually used (dev bundle vs prod bundle)
- Maintains type safety

**How?**

```typescript
const getImpl = async () => {
  if (useMock) return import('@/lib/api/clinic-mock')
  else return import('@/lib/api/clinic-real')
}
```

### 7.2 Centralized In-Memory State

**Why?**

- Single source of truth across auth, clinic, and family APIs
- Consistent data relationships (e.g., patient ↔ evolutions)
- No repeated data transformations
- Easier to add endpoints without data sync issues

**How?**

- Imported by handlers.ts and all mock implementations
- Exports typed getter/setter functions
- Maintains auto-incrementing IDs

### 7.3 Denormalization in Mock Data

**Pattern**: Some fields are denormalized (e.g., session stores patient_name AND patient_id)

**Why?**

- Mirrors real API design (likely from Django serializers)
- Makes rendering UI components easier (don't need to join data)
- `clinic-mock.ts` maps input data to denormalized form before storing

**Example**:

```typescript
// Input: { patient: 1, therapist: 2, date_time: '...', ... }
// Store: { id: X, patient: 1, patient_name: 'Leonardo Silva', therapist: 2, therapist_name: 'Ana Lima', ... }
```

### 7.4 Validation in Mock CRUD

**Pattern**: Business logic validations happen in both:

1. MSW handlers (for HTTP layer)
2. Mock API layer (for direct calls)

**Example - Evolution Creation**:

```typescript
// In state.ts AND clinic-mock.ts: validate session.status === 'completed'
```

---

## 8. Environment Variables

| Variable                 | Default               | Purpose                        | Mode      |
| ------------------------ | --------------------- | ------------------------------ | --------- |
| NEXT_PUBLIC_API_URL      | http://127.0.0.1:8000 | Backend API base URL           | Both      |
| NEXT_PUBLIC_DISABLE_MSW  | false                 | Disable mock (use real API)    | Both      |
| NEXT_PUBLIC_MOCK_USER_ID | 1                     | Default mock user if no cookie | Mock only |
| NODE_ENV                 | -                     | Determines if MSW initializes  | System    |

### 8.1 Environment Switching

**Development (Default)**:

```bash
NEXT_PUBLIC_DISABLE_MSW=false  # Use mock
NODE_ENV=development          # Enable MSW initialization
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**Production**:

```bash
NEXT_PUBLIC_DISABLE_MSW=true   # Use real API
NODE_ENV=production            # Skip MSW initialization
NEXT_PUBLIC_API_URL=https://api.production.com
```

**Development with Real API** (testing backend):

```bash
NEXT_PUBLIC_DISABLE_MSW=true   # Use real API
NODE_ENV=development           # Still useful for other things
```

---

## 9. Current Gaps & Where to Add Dashboard Mock Data

### 9.1 Clinic Dashboard

**Status**: Not yet implemented

**What's needed**:

- Clinic dashboard page: `src/app/clinic/dashboard/page.tsx`
- API endpoint: `/api/dashboard/` (handler exists, but returns minimal data)
- Mock data expansion in `state.ts`:
  - `getDashboardMetrics()` currently returns basic counts
  - Needs: today_sessions array with full session objects

**Where to add**:

1. Handler in `src/mocks/handlers.ts` line 252 (already exists, enhance return)
2. `state.getDashboardMetrics()` in `src/mocks/state.ts` line 219
3. Mock implementation in `src/lib/api/clinic-mock.ts` line 148
4. Real implementation in `src/lib/api/clinic-real.ts` line 108

### 9.2 Additional Evolutions for Family Dashboard

**Status**: Only 1 evolution in mock data

**What's needed for better testing**:

- Multiple evolutions released to family
- Historical evolution data
- Older evolution dates to test relative date calculation

**Where to add**:

1. `src/mocks/data/evolutions.ts` - add more evolution objects
2. Update `src/mocks/data/sessions.ts` - mark more as completed
3. `state.ts` will auto-increment IDs

### 9.3 Additional Patients & Sessions

**Status**: 4 patients, 5 sessions, only 1 complete with evolution

**What's needed**:

- More patients with different guardian emails
- Sessions across multiple dates
- Mix of released/unreleased evolutions

**Where to add**:

1. `src/mocks/data/patients.ts` - add more patients
2. `src/mocks/data/sessions.ts` - add more sessions
3. `src/mocks/data/evolutions.ts` - add evolutions linked to completed sessions

### 9.4 Family Portal Edge Cases

**Currently not tested**:

- Family with no patient found (patient = null)
- Family with patient but no evolutions
- Multiple evolutions (latest sorting)
- Very old evolutions (> 30 days)

**Components that need testing**:

- Empty state in `FamilyDashboardStats`
- Empty state in `LatestEvolutionCard`

---

## 10. File Reference Guide

### Authentication Files

- `src/lib/authService.ts` - Dispatcher (mock vs real)
- `src/lib/auth-mock.ts` - Mock auth implementation
- `src/lib/auth.ts` - Real auth implementation
- `src/lib/authResolver.ts` - Cookie/token resolution

### Mock Infrastructure

- `src/mocks/state.ts` - Centralized in-memory state
- `src/mocks/handlers.ts` - MSW request handlers
- `src/mocks/browser.ts` - MSW setup
- `instrumentation-client.ts` - MSW initialization hook

### Mock Data

- `src/mocks/data/users.ts` - Test users & tokens
- `src/mocks/data/patients.ts` - Test patients
- `src/mocks/data/sessions.ts` - Test sessions
- `src/mocks/data/evolutions.ts` - Test evolutions

### API Layer

- `src/lib/api/clinic.ts` - Clinic dispatcher
- `src/lib/api/clinic-mock.ts` - Clinic mock implementation
- `src/lib/api/clinic-real.ts` - Clinic real implementation
- `src/lib/api/family.ts` - Family dispatcher
- `src/lib/api/family-mock.ts` - Family mock implementation
- `src/lib/api/family-real.ts` - Family real implementation
- `src/lib/api/http.ts` - Generic HTTP client

### Dashboard Implementation

#### Clinic Dashboard

- `src/app/clinic/dashboard/page.tsx` - Clinic dashboard page
- `src/components/layout/clinic/ClinicLayout.tsx` - Layout wrapper with sidebar
- `src/components/layout/clinic/ClinicHeader.tsx` - Simple header placeholder
- `src/components/layout/clinic/ClinicNavbar.tsx` - Top navigation bar with search and user avatar
- `src/components/layout/clinic/ClinicSearchBar.tsx` - Search input with lucide icon
- `src/components/layout/clinic/ClinicUserAvatar.tsx` - User initials avatar display
- `src/components/layout/clinic/ClinicSidebar.tsx` - Main sidebar component
- `src/components/layout/clinic/ClinicSidebarHeader.tsx` - Header with Spectra logo
- `src/components/layout/clinic/ClinicSidebarNav.tsx` - Navigation links with active states
- `src/components/layout/clinic/ClinicSidebarFooter.tsx` - Footer content
- `src/components/layout/clinic/types.ts` - TypeScript types for sidebar

#### Family Dashboard

- `src/app/family/dashboard/page.tsx` - Family dashboard page
- `src/components/ui/family/FamilyDashboardStats.tsx` - Stats display
- `src/components/ui/family/LatestEvolutionCard.tsx` - Evolution card
- `src/components/layout/family/FamilyNavbar.tsx` - Responsive navigation
- `src/components/layout/family/FamilyHeader.tsx` - Header component
- `src/components/layout/family/types.ts` - TypeScript types for family layout

### Types

- `src/lib/types.ts` - Shared TypeScript types

### Middleware & Auth Actions

- `src/app/middleware.ts` - Route protection & redirects
- `src/app/actions/auth.ts` - Server actions for login/logout

---

## 11. Key Insights for Development

1. **No HTTP Calls in Mock Mode**: Mock implementations call `state.*` functions directly, not HTTP. This is efficient for testing.

2. **Lazy-Load Pattern**: Dispatcher modules use dynamic imports to avoid loading unused code paths.

3. **Consistent Error Messages**: Portuguese error messages for consistency with Brazilian Portuguese UI.

4. **Denormalization is Intentional**: Mock data mirrors real API structure with denormalized fields for easier rendering.

5. **Validation Happens Multiple Places**: Business logic lives in both `state.ts` (for direct calls) and handlers (for HTTP).

6. **Type Safety**: Full TypeScript with discriminated types ensure both mock and real implementations are type-safe.

7. **Family Portal is Read-Only**: Family users can only view released evolutions, no mutations.

8. **Auto-Increment IDs**: Mock state tracks next IDs by finding max and incrementing, allowing consistent ID generation even after deletions.

---

## 12. How to Add New Mock Data

### Pattern for Adding Evolutions

1. **Add session to `src/mocks/data/sessions.ts`**:

   ```typescript
   {
     id: 6,
     patient: 2,
     patient_name: 'Sofia Rodrigues',
     therapist: 2,
     therapist_name: 'Ana Lima',
     date_time: '2026-04-28T10:00:00Z',
     status: 'completed',  // MUST BE completed to have evolution
     notes: '...',
     is_deleted: false,
     created_at: '2026-04-25T10:00:00Z',
     updated_at: '2026-04-28T11:00:00Z',
   }
   ```

2. **Add evolution to `src/mocks/data/evolutions.ts`**:

   ```typescript
   {
     id: 2,
     session: 6,  // Links to new session
     therapist_name: 'Ana Lima',
     session_date: '2026-04-28T10:00:00Z',
     objective: '...',
     activities: '...',
     behavior: '...',
     progress: '...',
     next_steps: '...',
     released_to_family: true,  // Set to true to show in family portal
     created_at: '2026-04-28T11:30:00Z',
     updated_at: '2026-04-28T11:30:00Z',
   }
   ```

3. **IDs auto-increment**: `state.ts` finds the max ID in each collection and increments from there.

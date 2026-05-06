# Spectra Mock Implementation - Quick Reference Guide

## Environment Variables

```bash
# Development (Default) - Use Mock
NEXT_PUBLIC_DISABLE_MSW=false
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_MOCK_USER_ID=1  # Default user if no cookie

# Production - Use Real API
NEXT_PUBLIC_DISABLE_MSW=true
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.production.com
```

---

## Authentication Flow

```
LOGIN FORM
  ↓
authService.login(email, password)
  ├─ MOCK: Finds in mockUsers[] → stores in mockState → returns tokens
  └─ REAL: HTTP POST /api/auth/login/
  ↓
Server Action: cookies.set('access_token', userId)
  ↓
Redirect to /clinic/dashboard or /family/dashboard
  ↓
Middleware checks route + authResolver.getUser(cookie)
  ↓
Page fetches data with authenticated context
```

---

## Test Users (Mock Mode Only - Any Password Works)

| Email              | Role      | Patient        | Component     |
| ------------------ | --------- | -------------- | ------------- |
| admin@spectra.com  | admin     | -              | Clinic Portal |
| ana@spectra.com    | therapist | -              | Clinic Portal |
| carlos@spectra.com | therapist | -              | Clinic Portal |
| maria@gmail.com    | family    | Leonardo Silva | Family Portal |

---

## Mock Data Relationships

```
User: Maria Silva (id=4, email=maria@gmail.com)
  ↓ matches guardian_email
  Patient: Leonardo Silva (id=1, guardian_email=maria@gmail.com)
    ↓ has sessions
    Session: 1 (id=1, patient=1, status=completed)
      ↓ has evolution
      Evolution: 1 (id=1, session=1, released_to_family=true)
```

---

## Current Mock Data Counts

| Entity     | Total | Notes                                 |
| ---------- | ----- | ------------------------------------- |
| Users      | 4     | 1 admin, 2 therapists, 1 family       |
| Patients   | 4     | All active                            |
| Sessions   | 5     | 1 completed, 3 scheduled, 1 cancelled |
| Evolutions | 1     | Released to family                    |

---

## How API Calls Work

### 1. Dispatcher Pattern (src/lib/api/clinic.ts)

```typescript
const useMock = process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'

export async function getPatients() {
  const impl = await getImpl() // Loads clinic-mock or clinic-real
  return impl.getPatients()
}
```

### 2. Mock Implementation (src/lib/api/clinic-mock.ts)

```typescript
export function getPatients(): Promise<Patient[]> {
  return Promise.resolve(state.getPatients()) // Direct state call
}
```

### 3. Real Implementation (src/lib/api/clinic-real.ts)

```typescript
export function getPatients() {
  return http<Patient[]>('/api/patients/') // HTTP call
}
```

---

## MSW Handler Structure

```typescript
// src/mocks/handlers.ts

export const handlers = [
  http.get(`${BASE_URL}/api/patients/`, () => {
    return HttpResponse.json(state.getPatients())
  }),

  http.post(`${BASE_URL}/api/patients/`, async ({ request }) => {
    const body = await request.json()
    const newPatient = state.createPatient(body)
    return HttpResponse.json(newPatient, { status: 201 })
  }),

  // ... more handlers
]
```

---

## Mock State Functions (src/mocks/state.ts)

### Authentication

```typescript
setCurrentUser(user: User)      // Store logged-in user
getCurrentUser(): User | null   // Get logged-in user
clearCurrentUser()              // Clear logged-in user
```

### Patients

```typescript
getPatients(): Patient[]
getPatientById(id: number): Patient | undefined
getPatientByGuardianEmail(email: string): Patient | null
createPatient(data): Patient
updatePatient(id: number, data): Patient | undefined
deletePatient(id: number): boolean
```

### Sessions

```typescript
getSessions(): Session[]
getSessionById(id: number): Session | undefined
createSession(data): Session       // Auto-populates patient_name, therapist_name
updateSession(id: number, data): Session | undefined
deleteSession(id: number): boolean
```

### Evolutions

```typescript
getEvolutions(): Evolution[]
getEvolutionById(id: number): Evolution | undefined
getFamilyEvolutions(): Evolution[]  // Only released_to_family=true
createEvolution(data): Evolution    // Validates session.status='completed'
updateEvolution(id: number, data): Evolution | undefined
```

### Dashboard

```typescript
getDashboardMetrics(): {
  today_sessions: Session[]
  active_patients: number
  pending_evolutions: number
}
```

---

## Family Dashboard Data Flow

```typescript
// src/app/family/dashboard/page.tsx

async function FamilyDashboard() {
  // 1. Get auth cookie
  const cookieValue = (await cookies()).get('access_token')?.value

  // 2. Resolve user (Maria Silva, id=4)
  const user = await authResolver.getUser(cookieValue)

  // 3. Get patient by email match
  const patient = await getPatientByGuardianEmail('maria@gmail.com')
  // Result: Leonardo Silva (id=1)

  // 4. Get evolutions (released_to_family=true)
  const evolutions = await getFamilyEvolutions()
  // Result: [{ id: 1, session: 1, ... }]

  // 5. Get latest evolution
  const latest = evolutions[0]

  // 6. Render with:
  // - Avatar: "LS" (patient initials)
  // - Stats: Total sessions (1), Last session ("Hoje")
  // - Evolution card: Latest evolution details
}
```

---

## Adding New Mock Data

### Add a Session with Evolution

1. **Edit src/mocks/data/sessions.ts**

```typescript
{
  id: 6,
  patient: 2,
  patient_name: 'Sofia Rodrigues',
  therapist: 2,
  therapist_name: 'Ana Lima',
  date_time: '2026-04-28T10:00:00Z',
  status: 'completed',  // IMPORTANT: Must be 'completed' to have evolution
  notes: 'Notes here',
  is_deleted: false,
  created_at: '2026-04-25T10:00:00Z',
  updated_at: '2026-04-28T11:00:00Z',
}
```

2. **Edit src/mocks/data/evolutions.ts**

```typescript
{
  id: 2,
  session: 6,  // Link to session
  therapist_name: 'Ana Lima',
  session_date: '2026-04-28T10:00:00Z',
  objective: 'Objective here',
  activities: 'Activities here',
  behavior: 'Behavior here',
  progress: 'Progress here',
  next_steps: 'Next steps here',
  released_to_family: true,  // Show to family portal
  created_at: '2026-04-28T11:30:00Z',
  updated_at: '2026-04-28T11:30:00Z',
}
```

3. **IDs auto-increment** - state.ts finds max and increments

---

## API Endpoints & Handlers

| Endpoint                | Method | Handler Location | State Function        |
| ----------------------- | ------ | ---------------- | --------------------- |
| /api/auth/login/        | POST   | handlers.ts:21   | -                     |
| /api/auth/refresh/      | POST   | handlers.ts:40   | -                     |
| /api/patients/          | GET    | handlers.ts:52   | getPatients()         |
| /api/patients/          | POST   | handlers.ts:60   | createPatient()       |
| /api/patients/:id/      | GET    | handlers.ts:75   | getPatientById()      |
| /api/patients/:id/      | PUT    | handlers.ts:87   | updatePatient()       |
| /api/patients/:id/      | DELETE | handlers.ts:102  | deletePatient()       |
| /api/sessions/          | GET    | handlers.ts:118  | getSessions()         |
| /api/sessions/          | POST   | handlers.ts:126  | createSession()       |
| /api/sessions/:id/      | GET    | handlers.ts:141  | getSessionById()      |
| /api/sessions/:id/      | PUT    | handlers.ts:153  | updateSession()       |
| /api/sessions/:id/      | DELETE | handlers.ts:168  | deleteSession()       |
| /api/evolutions/        | POST   | handlers.ts:187  | createEvolution()     |
| /api/evolutions/:id/    | GET    | handlers.ts:202  | getEvolutionById()    |
| /api/evolutions/:id/    | PUT    | handlers.ts:214  | updateEvolution()     |
| /api/evolutions/        | GET    | handlers.ts:229  | getEvolutions()       |
| /api/evolutions/family/ | GET    | handlers.ts:237  | getFamilyEvolutions() |
| /api/dashboard/         | GET    | handlers.ts:252  | getDashboardMetrics() |

---

## Key Files to Understand

### Core Mock Files

- `src/mocks/state.ts` - In-memory database
- `src/mocks/handlers.ts` - MSW request handlers
- `src/mocks/browser.ts` - MSW setup

### Mock Data

- `src/mocks/data/users.ts`
- `src/mocks/data/patients.ts`
- `src/mocks/data/sessions.ts`
- `src/mocks/data/evolutions.ts`

### Authentication

- `src/lib/authService.ts` - Dispatcher
- `src/lib/auth-mock.ts` - Mock impl
- `src/lib/auth.ts` - Real impl
- `src/lib/authResolver.ts` - Cookie resolution

### Utils

- `src/lib/utils/dateUtils.ts` - getRelativeDate() for Portuguese relative dates
- `src/lib/utils/stringUtils.ts` - extractInitials() for name-to-initials conversion

### API Layer

- `src/lib/api/clinic.ts` - Clinic dispatcher
- `src/lib/api/clinic-mock.ts` - Clinic mock
- `src/lib/api/clinic-real.ts` - Clinic real
- `src/lib/api/family.ts` - Family dispatcher
- `src/lib/api/family-mock.ts` - Family mock
- `src/lib/api/family-real.ts` - Family real
- `src/lib/api/http.ts` - HTTP client

### Dashboard

- `src/app/clinic/dashboard/page.tsx` - Clinic dashboard
- `src/components/layout/clinic/ClinicLayout.tsx` - Clinic layout wrapper
- `src/components/layout/clinic/ClinicHeader.tsx` - Simple header placeholder
- `src/components/layout/clinic/ClinicNavbar.tsx` - Top navigation bar with search and avatar
- `src/components/layout/clinic/ClinicSearchBar.tsx` - Search input with icon
- `src/components/layout/clinic/ClinicUserAvatar.tsx` - User initials avatar
- `src/components/layout/clinic/ClinicSidebar.tsx` - Clinic sidebar component
- `src/components/layout/clinic/ClinicSidebarHeader.tsx` - Sidebar header with logo
- `src/components/layout/clinic/ClinicSidebarNav.tsx` - Sidebar navigation links
- `src/components/layout/clinic/ClinicSidebarFooter.tsx` - Sidebar footer
- `src/components/layout/clinic/types.ts` - Sidebar TypeScript types

- `src/app/family/dashboard/page.tsx` - Family dashboard
- `src/components/ui/family/FamilyDashboardStats.tsx`
- `src/components/ui/family/LatestEvolutionCard.tsx`

---

## Debugging Tips

### Check which mode is active

```typescript
// In browser console
console.log(process.env.NEXT_PUBLIC_DISABLE_MSW)
// false = mock mode, true = real API mode
```

### View mock state

```typescript
// If in mock mode, import and check state
import * as state from '@/mocks/state'
console.log(state.getPatients())
console.log(state.getFamilyEvolutions())
```

### Test authentication

```bash
# Login as family user (maria@gmail.com)
# Check cookie: access_token = 4 (user id)

# Login as therapist (ana@spectra.com)
# Check cookie: access_token = 2 (user id)
```

### Check MSW is working

```typescript
// Open DevTools → Network tab
// Requests to /api/* should show (from mocked response)
// If real requests appear, MSW may be disabled or NODE_ENV != development
```

---

## Common Issues

| Issue                        | Cause                        | Solution                                           |
| ---------------------------- | ---------------------------- | -------------------------------------------------- |
| API calls hit real server    | NEXT_PUBLIC_DISABLE_MSW=true | Set to false for mock mode                         |
| MSW not intercepting         | NODE_ENV != development      | Set NODE_ENV=development                           |
| Family can't see evolutions  | released_to_family=false     | Set to true in evolutions.ts                       |
| Session can't have evolution | status != 'completed'        | Change session status to completed                 |
| Patient not found            | guardian_email mismatch      | Ensure family email matches patient guardian_email |

---

## Next Steps for Expansion

1. Add more evolutions to test pagination/history
2. Add clinic dashboard implementation
3. Add more test users for different scenarios
4. Implement patient CRUD UI in clinic portal
5. Add session scheduling UI
6. Implement evolution creation form

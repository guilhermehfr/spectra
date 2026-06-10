# Spectra Mock Implementation - Architecture Diagrams

## 1. Environment-Based Routing

```
┌─────────────────────────────────────────────────────────────────┐
│                    Page/Component Calls API                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ await getPatients()
                         ↓
        ┌────────────────────────────────┐
        │ src/lib/api/clinic.ts          │
        │ (Lazy-Load Dispatcher)         │
        └───────┬──────────────────┬─────┘
                │                  │
        ┌───────▼──────┐    ┌──────▼────────┐
        │ MOCK MODE    │    │ REAL MODE     │
        │DISABLE_MSW=F │    │DISABLE_MSW=T  │
        └───────┬──────┘    └──────┬────────┘
                │                  │
        ┌───────▼──────────────┐   │
        │clinic-mock.ts        │   │
        │getPatients()         │   │
        │  → state.getPatients()   │
        │  → Promise.resolve()     │
        └───────┬──────────────┘   │
                │                  │
                │              ┌───▼──────────────┐
                │              │clinic-real.ts    │
                │              │getPatients()     │
                │              │  → http<>()      │
                │              │  → HTTP GET      │
                │              └───┬──────────────┘
                │                  │
                └──────┬───────────┘
                       │
                       ↓
                ┌─────────────┐
                │Promise<T>   │
                └─────────────┘
```

---

## 2. Mock State - Centralized In-Memory Database

```
┌─────────────────────────────────────────────────────────────────┐
│                    src/mocks/state.ts                           │
│              (Centralized In-Memory State)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │   Auth State         │  │   User Management    │             │
│  │                      │  │                      │             │
│  │ let currentUser      │  │ setCurrentUser()     │             │
│  │                      │  │ getCurrentUser()     │             │
│  │                      │  │ clearCurrentUser()   │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Patients[]          │  │  Patient Operations  │             │
│  │  (4 initial items)   │  │                      │             │
│  │  - is_deleted: false │  │ getPatients()        │             │
│  │  - auto-increment ID │  │ getPatientById()     │             │
│  │                      │  │ getPatientByEmail()  │             │
│  │                      │  │ createPatient()      │             │
│  │                      │  │ updatePatient()      │             │
│  │                      │  │ deletePatient()      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Sessions[]          │  │  Session Operations  │             │
│  │  (5 initial items)   │  │                      │             │
│  │  - Denormalized:     │  │ getSessions()        │             │
│  │    patient_name      │  │ getSessionById()     │             │
│  │    therapist_name    │  │ createSession()      │             │
│  │  - is_deleted: false │  │ updateSession()      │             │
│  │                      │  │ deleteSession()      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  Evolutions[]        │  │ Evolution Operations │             │
│  │  (1 initial item)    │  │                      │             │
│  │  - Links to Session  │  │ getEvolutions()      │             │
│  │  - Denormalized:     │  │ getFamilyEvolutions()│             │
│  │    therapist_name    │  │ createEvolution()    │             │
│  │    session_date      │  │ updateEvolution()    │             │
│  │  - released_to_family│  │                      │             │
│  │                      │  │ getDashboardMetrics()│             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
    Used by:              Used by:            Used by:
  handlers.ts         clinic-mock.ts      family-mock.ts
```

---

## 3. Authentication Flow

```
┌──────────────┐
│ Login Page   │
└──────┬───────┘
       │
       │ onClick: handleLogin(email, password)
       ↓
┌──────────────────────────────────────────┐
│ Server Action: loginAction()              │
│ src/app/actions/auth.ts                  │
└──────┬───────────────────────────────────┘
       │
       │ authService.login(credentials)
       ↓
┌──────────────────────────────────────────┐
│ authService dispatcher                    │
│ src/lib/authService.ts                   │
└──────┬────────────────┬───────────────────┘
       │                │
  ┌────▼────┐      ┌────▼────┐
  │ MOCK     │      │ REAL     │
  └────┬────┘      └────┬────┘
       │                │
   ┌───▼──────────┐    │
   │loginMock()   │    │
   │ 1. Find user │    │ ┌─────────────────┐
   │    in mockUsers    │ │ login() real    │
   │ 2. setCurrentUser()│ │ POST /api/auth/ │
   │ 3. Return tokens  │ │ login/          │
   └───┬──────────┘    │ └────┬────────────┘
       │                │       │
       └────┬───────────┘       │
            │                   │
            └───────┬───────────┘
                    │
                    ↓
        ┌─────────────────────┐
        │ Return: {           │
        │   access: token,    │
        │   user: User        │
        │ }                   │
        └────────┬────────────┘
                 │
                 │ cookies.set('access_token', user.id)
                 ↓
        ┌─────────────────────┐
        │ redirect(dashboard) │
        └────────┬────────────┘
                 │
                 ↓
        ┌─────────────────────┐
        │ Middleware checks   │
        │ auth + redirects    │
        └────────┬────────────┘
                 │
                 ↓
        ┌─────────────────────┐
        │ Dashboard loads     │
        │ with auth context   │
        └─────────────────────┘
```

---

## 4. Family Dashboard Data Resolution

```
┌────────────────────────────────────────────────────────────────┐
│ User: Maria Silva (family)                                     │
│ - Logs in with maria@gmail.com                                 │
│ - Cookie: access_token=4 (user id)                             │
└──────┬─────────────────────────────────────────────────────────┘
       │
       ↓
┌────────────────────────────────────────────────────────────────┐
│ src/app/family/dashboard/page.tsx                              │
└──────┬─────────────────────────────────────────────────────────┘
       │
       │ 1. Get auth cookie value (4)
       │    ↓
       ├─→ cookies().get('access_token')?.value
       │   ↓
       ├─→ Result: "4"
       │
       │ 2. Resolve user from cookie
       │    ↓
       ├─→ authResolver.getUser("4")
       │   ├─→ MOCK: mockUsers.find(u => u.id === 4)
       │   └─→ Result: { id: 4, email: 'maria@gmail.com', role: 'family' }
       │
       │ 3. Get patient by guardian email
       │    ↓
       ├─→ getPatientByGuardianEmail('maria@gmail.com')
       │   ├─→ MOCK: state.getPatientByGuardianEmail(email)
       │   │   └─→ Find patient where guardian_email = 'maria@gmail.com'
       │   │
       │   └─→ REAL: HTTP GET /api/patients/ → filter
       │
       │   Result: {
       │     id: 1,
       │     name: 'Leonard Silva',
       │     guardian_email: 'maria@gmail.com'
       │   }
       │
       │ 4. Get evolutions
       │    ↓
       ├─→ getFamilyEvolutions()
       │   ├─→ MOCK: state.getFamilyEvolutions()
       │   │   └─→ Filter: released_to_family = true
       │   │
       │   └─→ REAL: HTTP GET /api/evolutions/family/
       │
       │   Result: [
       │     {
       │       id: 1,
       │       session: 1,
       │       session_date: '2026-04-29T09:00:00Z',
       │       therapist_name: 'Ana Lima',
       │       objective: '...',
       │       activities: '...',
       │       behavior: '...',
       │       progress: '...',
       │       next_steps: '...',
       │       created_at: '2026-04-29T10:30:00Z',
       │     }
       │   ]
       │
       │ 5. Compute display data
       │    ├─→ Latest evolution (sort by created_at desc)
       │    ├─→ Total sessions = evolutions.length (1)
       │    ├─→ Patient initials = "LS"
       │    └─→ Last session date = relative format
       │
       ↓
┌────────────────────────────────────────────────────────────────┐
│ Render Dashboard:                                              │
│                                                                │
│ ┌──────┐  Olá, Maria Silva                                    │
│ │ LS   │  Histórico de Leonard Silva                         │
│ └──────┘
│
│ ┌────────────────────────────────────────────┐
│ │ Total de Sessões    │ Última Sessão       │
│ │        1            │     Hoje            │
│ └────────────────────────────────────────────┘
│
│ ┌────────────────────────────────────────────┐
│ │ NOTAS DOS TERAPEUTAS                       │
│ │                                            │
│ │ Terapeuta. Ana Lima                        │
│ │                                            │
│ │ Objetivo: Aumentar tempo de atenção...     │
│ │ Atividades: Brincadeira com blocos...      │
│ │ Comportamento: Tranquilo e focado...       │
│ │ Progresso: Ótimo avanço...                 │
│ │ Próximas Etapas: Introduzir atividade...   │
│ │                                            │
│ └────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────────┘
```

---

## 5. MSW Request Interception

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Application                          │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ fetch('/api/patients/')
       ↓
┌─────────────────────────────────────────────────────────────────┐
│          MSW Service Worker (Browser)                            │
│          (Only in dev when NEXT_PUBLIC_DISABLE_MSW=false)        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Intercepts fetch request:                               │   │
│  │ GET http://127.0.0.1:8000/api/patients/                │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                           │
│                     │ Match handler pattern?                    │
│                     ↓                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ http.get(`${BASE_URL}/api/patients/`, () => {           │   │
│  │   return HttpResponse.json(state.getPatients())         │   │
│  │ })                                                       │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                           │
│                     ↓                                           │
│             ┌───────────────┐                                   │
│             │ Call handler  │                                   │
│             │ function      │                                   │
│             └───────┬───────┘                                   │
│                     │                                           │
│                     ↓                                           │
│          ┌──────────────────────┐                               │
│          │ state.getPatients()  │                               │
│          │ Returns Patient[]    │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ↓                                           │
│       ┌──────────────────────────┐                              │
│       │ HttpResponse.json(data)  │                              │
│       │ Status: 200              │                              │
│       │ Body: JSON array         │                              │
│       └──────────┬───────────────┘                              │
│                  │                                              │
│  onUnhandledRequest: 'bypass'                                   │
│  = Unknown routes pass through                                  │
│                                                                 │
└──────────────────┬─────────────────────────────────────────────┘
                   │
                   │ Return intercepted response
                   ↓
┌──────────────────────────────────┐
│ Browser receives Response        │
│ Status 200, Body: [patients...]  │
└──────────────────────────────────┘
```

---

## 6. Data Flow: Adding a New Patient (Mock Mode)

```
┌─────────────────┐
│ Clinic Portal   │
│ Add Patient Form│
└────────┬────────┘
         │
         │ onClick: createPatient(formData)
         ↓
┌──────────────────────────────────────────────┐
│ Server Action: createPatientAction()         │
│ src/app/actions/patient.ts                  │
└────────┬─────────────────────────────────────┘
         │
         │ clinic.createPatient({
         │   name, birth_date, guardian_name,
         │   guardian_email, notes
         │ })
         ↓
┌──────────────────────────────────────────────┐
│ src/lib/api/clinic.ts (Dispatcher)           │
└────────┬─────────────────────────────────────┘
         │
         │ MOCK: DISABLE_MSW=false
         ↓
┌──────────────────────────────────────────────┐
│ clinic-mock.ts: createPatient()              │
│                                              │
│ return state.createPatient(data)             │
└────────┬─────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────┐
│ src/mocks/state.ts: createPatient()          │
│                                              │
│ 1. nextPatientId++ (now: 5)                  │
│ 2. Add timestamps                            │
│ 3. Set is_deleted: false                     │
│ 4. patients.push(newPatient)                 │
│ 5. Return new patient object                 │
└────────┬─────────────────────────────────────┘
         │
         ↓ Promise.resolve(newPatient)
┌──────────────────────────────────────────────┐
│ Server Action receives Patient object        │
│ - id: 5 (auto-generated)                     │
│ - created_at: current timestamp              │
│ - is_deleted: false                          │
└────────┬─────────────────────────────────────┘
         │
         │ Redirect or revalidate
         ↓
┌──────────────────────────────────────────────┐
│ Page updates showing new patient             │
│ (Next.js revalidates cache)                  │
└──────────────────────────────────────────────┘
```

---

## 7. MSW Handler Pattern for CRUD Operations

```
┌────────────────────────────────────────────────────────────────────┐
│                       GET /api/patients/                           │
├────────────────────────────────────────────────────────────────────┤
│  http.get(`${BASE_URL}/api/patients/`, () => {                    │
│    return HttpResponse.json(state.getPatients())                  │
│  })                                                                │
│  → Returns all non-deleted patients                               │
│  → Status: 200 (default)                                          │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       POST /api/patients/                          │
├────────────────────────────────────────────────────────────────────┤
│  http.post(`${BASE_URL}/api/patients/`, async ({ request }) => {  │
│    const body = await request.json()                              │
│    try {                                                           │
│      const newPatient = state.createPatient(body)                 │
│      return HttpResponse.json(newPatient, { status: 201 })       │
│    } catch (error) {                                              │
│      return HttpResponse.json(                                     │
│        { detail: error.message },                                 │
│        { status: 400 }                                            │
│      )                                                            │
│    }                                                              │
│  })                                                               │
│  → Validates and creates patient                                 │
│  → Status: 201 (Created) or 400 (Error)                          │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       GET /api/patients/:id/                       │
├────────────────────────────────────────────────────────────────────┤
│  http.get(`${BASE_URL}/api/patients/:id/`, ({ params }) => {      │
│    const patient = state.getPatientById(Number(params.id))        │
│    if (!patient) {                                                │
│      return HttpResponse.json(                                     │
│        { detail: 'Não encontrado.' },                             │
│        { status: 404 }                                            │
│      )                                                            │
│    }                                                              │
│    return HttpResponse.json(patient)                              │
│  })                                                               │
│  → Retrieves by ID                                               │
│  → Status: 200 or 404                                            │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       DELETE /api/patients/:id/                    │
├────────────────────────────────────────────────────────────────────┤
│  http.delete(`${BASE_URL}/api/patients/:id/`, ({ params }) => {   │
│    const deleted = state.deletePatient(Number(params.id))         │
│    if (!deleted) {                                                │
│      return HttpResponse.json(                                     │
│        { detail: 'Não encontrado.' },                             │
│        { status: 404 }                                            │
│      )                                                            │
│    }                                                              │
│    return new HttpResponse(null, { status: 204 })                │
│  })                                                               │
│  → Soft-delete (sets is_deleted: true)                           │
│  → Status: 204 (No Content) or 404                               │
└────────────────────────────────────────────────────────────────────┘
```

---

## 8. Type Safety Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Types                             │
│              src/lib/types.ts                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  export type Patient = {                                    │
│    id: number                                               │
│    name: string                                             │
│    birth_date: string                                       │
│    guardian_name: string                                    │
│    guardian_email: string                                  │
│    notes: string                                            │
│    created_at: string                                       │
│    updated_at: string                                       │
│    is_deleted: boolean                                      │
│  }                                                          │
│                                                             │
│  export type CreatePatientInput = Omit<                     │
│    Patient,                                                 │
│    'id' | 'created_at' | 'updated_at' | 'is_deleted'      │
│  >                                                          │
│                                                             │
└────────────┬──────────────────────┬─────────────────────────┘
             │                      │
      ┌──────▼──────┐        ┌──────▼──────┐
      │  Mock API   │        │  Real API   │
      │ expects:    │        │ expects:    │
      │ Patient     │        │ Patient     │
      │ Input →     │        │ Input →     │
      │ Output      │        │ Output      │
      └─────────────┘        └─────────────┘
             │                      │
             │ Both return          │ Both return
             │ Promise<Patient>     │ Promise<Patient>
             │                      │
             └──────────┬───────────┘
                        │
                ┌───────▼────────┐
                │ Page Component │
                │ Receives:      │
                │ Patient[]      │
                │ (Type-safe)    │
                └────────────────┘
```

---

## 9. Soft Delete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Initial State                                  │
│                                                                 │
│  patients = [                                                   │
│    { id: 1, name: 'Patient A', is_deleted: false },            │
│    { id: 2, name: 'Patient B', is_deleted: false },            │
│    { id: 3, name: 'Patient C', is_deleted: false },            │
│  ]                                                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ DELETE /api/patients/2/
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                 deletePatient(2)                                │
│                                                                 │
│  - Find patient with id=2                                       │
│  - Set is_deleted: true                                         │
│  - Do NOT remove from array                                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              After Soft Delete                                  │
│                                                                 │
│  patients = [                                                   │
│    { id: 1, name: 'Patient A', is_deleted: false },            │
│    { id: 2, name: 'Patient B', is_deleted: true },  ← Soft del  │
│    { id: 3, name: 'Patient C', is_deleted: false },            │
│  ]                                                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ getPatients() filters out soft-deleted
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              GET /api/patients/                                 │
│                                                                 │
│  patients.filter(p => !p.is_deleted)                           │
│                                                                 │
│  Returns:                                                       │
│    { id: 1, name: 'Patient A', is_deleted: false },            │
│    { id: 3, name: 'Patient C', is_deleted: false },            │
│  ]                                                              │
│                                                                 │
│  Patient B is hidden but recoverable if needed                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Denormalization Example: Session Creation

```
┌──────────────────────────────────────────────────────────┐
│            Input to createSession()                      │
│                                                          │
│  {                                                       │
│    patient: 1,          ← Just the ID                   │
│    therapist: 2,        ← Just the ID                   │
│    date_time: '...',                                    │
│    status: 'scheduled',                                 │
│    notes: 'Session notes'                               │
│  }                                                       │
└─────────────────┬────────────────────────────────────────┘
                  │
                  │ createSession() looks up related data
                  ↓
        ┌──────────────────────┐
        │ Find patient: 1      │ → Leonard Silva
        │ Find therapist: 2    │ → Ana Lima
        └──────────────────────┘
                  │
                  ↓
┌──────────────────────────────────────────────────────────┐
│         Stored in state.sessions                         │
│                                                          │
│  {                                                       │
│    id: 1,                  ← Auto-incremented           │
│    patient: 1,             ← ID (original)              │
│    patient_name: 'Leonard Silva',    ← Denormalized    │
│    therapist: 2,           ← ID (original)              │
│    therapist_name: 'Ana Lima',        ← Denormalized    │
│    date_time: '2026-04-29T09:00:00Z',                  │
│    status: 'scheduled',                                │
│    notes: 'Session notes',                              │
│    is_deleted: false,                                   │
│    created_at: '2026-04-25T10:00:00Z',                │
│    updated_at: '2026-04-25T10:00:00Z',                │
│  }                                                       │
└──────────────────────────────────────────────────────────┘
                  │
                  │ Returned to UI
                  ↓
┌──────────────────────────────────────────────────────────┐
│        UI Renders Session Card                           │
│                                                          │
│   ┌────────────────────────────────────┐               │
│   │ Leonard Silva                     │               │
│   │ Therapist: Ana Lima                │               │
│   │ Time: 09:00                        │               │
│   │ Status: Scheduled                  │               │
│   └────────────────────────────────────┘               │
│                                                          │
│   No need to join with patient/therapist data          │
│   All needed data already present                       │
└──────────────────────────────────────────────────────────┘
```

---

## 11. Evolution Creation Validation Chain

```
┌───────────────────────────────────────────────────────────────┐
│        POST /api/evolutions/ (clinicEvolution)               │
│                                                               │
│  Input:                                                       │
│    session: 1                                                 │
│    objective: '...'                                           │
│    activities: '...'                                          │
│    behavior: '...'                                            │
│    progress: '...'                                            │
│    next_steps: '...'                                          │
│    released_to_family: true                                  │
└──────┬────────────────────────────────────────────────────────┘
       │
       │ Handler calls: state.createEvolution(data)
       ↓
┌───────────────────────────────────────────────────────────────┐
│  src/mocks/state.ts: createEvolution()                       │
│                                                               │
│  VALIDATION 1: Does session exist?                           │
│    const session = sessions.find(s => s.id === data.session) │
│    if (!session) → Error                                     │
│                                                               │
│  VALIDATION 2: Is session completed?                         │
│    if (session.status !== 'completed') → Error               │
│    "A sessão precisa estar com status completed."            │
│                                                               │
│  VALIDATION 3: Already has evolution?                        │
│    if (evolutions.find(e => e.session === data.session))     │
│      → Error: "Já existe uma evolução para esta sessão."     │
│                                                               │
│  If all pass:                                                 │
│    ✓ Proceed to create evolution                             │
│    ✓ Auto-populate denormalized fields:                      │
│      - session_date from session.date_time                   │
│      - therapist_name from session.therapist_name            │
│    ✓ Return new evolution object                             │
└──────┬────────────────────────────────────────────────────────┘
       │
       ├─ Error path:
       │  ↓
       │  HttpResponse.json({ detail: error.message }, { status: 400 })
       │
       └─ Success path:
          ↓
          HttpResponse.json(newEvolution, { status: 201 })
```

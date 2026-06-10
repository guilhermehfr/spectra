# API Documentation - Spectra Backend

## 🔐 Authentication

### Login
Login with email and password to obtain JWT tokens.

**Endpoint:**
```
POST /api/auth/login/
```

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "sua_senha_aqui"
}
```

**Response (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@example.com",
    "first_name": "Primeiro",
    "last_name": "Sobrenome",
    "role": "therapist",
    "phone": "+5511987654321",
    "is_active": true
  }
}
```

**Errors:**
- `400`: Invalid credentials
- `400`: Deactivated account

---

### Current User
Get authenticated user data.

**Endpoint:**
```
GET /api/auth/me/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@example.com",
  "first_name": "Primeiro",
  "last_name": "Sobrenome",
  "role": "therapist",
  "phone": "+5511987654321",
  "is_active": true
}
```

**Permissions:** Any authenticated user

---

### Logout
Logout from the system.

**Endpoint:**
```
POST /api/auth/logout/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "detail": "Logout realizado com sucesso"
}
```

**Permissions:** Any authenticated user

---

### Refresh Token
Renew the access token using the refresh token.

**Endpoint:**
```
POST /api/auth/refresh/
```

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Required headers for authenticated requests:**
```
Authorization: Bearer {access_token}
```

---

## 👥 Therapists

### List Therapists
Returns a list of active therapists. Useful for admins when creating/editing sessions.

**Endpoint:**
```
GET /api/therapists/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 10,
    "username": "ana",
    "email": "ana@spectra.com",
    "first_name": "Ana",
    "last_name": "Costa",
    "role": "therapist",
    "phone": "",
    "is_active": true
  }
]
```

**Permissions:** Therapists and Admins only

---

## 👥 Patients

### List Patients
List all patients in the system.

**Endpoint:**
```
GET /api/patients/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200) - Paginated:**
```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "João Silva",
      "birth_date": "2015-03-10",
      "guardian_name": "Maria Silva",
      "guardian_email": "maria@example.com",
      "notes": "Notas sobre o paciente",
      "created_at": "2026-04-29T10:30:00Z",
      "updated_at": "2026-04-29T10:30:00Z"
    }
  ]
}
```

**Pagination:**
- `count`: Total records
- `results`: Array with current page data
- `next`/`previous`: Links to next/previous page (null if none)
- `PAGE_SIZE`: 20 records per page (default)

**Permissions:** Therapists and Admins only

---

### Get Family Patient
Get the patient associated with the logged-in guardian's email.

**Endpoint:**
```
GET /api/patients/family/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Leonard Silva",
  "birth_date": "2017-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@spectra.com",
  "notes": "Paciente com TEA nível 2",
  "created_at": "2026-05-05T22:24:49Z",
  "updated_at": "2026-05-05T22:24:49Z"
}
```

**Response (404):**
```json
{
  "detail": "Nenhum paciente encontrado para este responsável."
}
```

**Permissions:** Family members only (role: family)

---

### Create Patient
Create a new patient in the system.

**Endpoint:**
```
POST /api/patients/
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@example.com",
  "notes": "Paciente com diagnóstico de autismo"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@example.com",
  "notes": "Paciente com diagnóstico de autismo",
  "created_at": "2026-04-29T10:30:00Z",
  "updated_at": "2026-04-29T10:30:00Z"
}
```

**Validations:**
- `name`: Required, cannot be empty
- `guardian_email`: Must be a valid email (optional)

**Permissions:** Therapists and Admins only

---

### Patient Details
Get detailed information about a patient.

**Endpoint:**
```
GET /api/patients/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@example.com",
  "notes": "Paciente com diagnóstico de autismo",
  "created_at": "2026-04-29T10:30:00Z",
  "updated_at": "2026-04-29T10:30:00Z"
}
```

**Permissions:** Therapists and Admins only

---

### Update Patient
Update a patient's information.

**Endpoint:**
```
PUT /api/patients/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria.silva@example.com",
  "notes": "Notas atualizadas"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria.silva@example.com",
  "notes": "Notas atualizadas",
  "created_at": "2026-04-29T10:30:00Z",
  "updated_at": "2026-04-29T10:31:00Z"
}
```

**Permissions:** Therapists and Admins only

---

### Delete Patient
Remove a patient from the system.

**Endpoint:**
```
DELETE /api/patients/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

**Permissions:** Therapists and Admins only

---

## 📅 Sessions (Schedule)

### List Sessions
List sessions (Therapists see their own; Admin sees all).

**Endpoint:**
```
GET /api/sessions/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

### Create Session
**Endpoint:**
```
POST /api/sessions/
```

**Request:**
```json
{
  "patient": 1,
  "date_time": "2026-05-10T14:00:00Z",
  "status": "scheduled",
  "notes": "Sessão de fonoaudiologia"
  // "therapist": 2 -> Optional field if the sender is admin; Logged-in therapists assign to themselves.
}
```

**Validations:**
- Does not allow past dates.

### Manage Session
`GET/PUT/DELETE /api/sessions/{id}/`
Update to set as `"completed"` after it is done.

---

## 📈 Therapeutic Evolution

### Create Evolution
Records an evolution only if the Session is complete (`"status": "completed"`). Another rule: Only 1 evolution per session is allowed.

**Endpoint:**
```
POST /api/evolutions/
```

**Request:**
```json
{
  "session": 1,
  "objective": "Aumentar vocabulário.",
  "activities": "Brincadeiras conjuntas.",
  "behavior": "Tranquilo e focado.",
  "progress": "Muito bom.",
  "next_steps": "Continuar com fichas.",
  "released_to_family": false
}
```

**Fields:**
- `session` (required): Completed session ID
- `objective` (required): Session objective
- `activities` (required): Activities performed
- `behavior` (required): Observed behavior
- `progress` (required): Patient progress
- `next_steps` (required): Next steps
- `released_to_family` (optional, default: false): Whether the evolution can be viewed by the family

**Validations:**
- Session must have `status: "completed"`
- Each session can have only 1 evolution

### List Evolutions (Clinical)
List all evolutions created by the clinic.

**Endpoint:**
```
GET /api/evolutions/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200) - Paginated:**
```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "session": 1,
      "session_details": {...},
      "session_date": "2026-04-21T22:24:49Z",
      "therapist_name": "Ana Costa",
      "author_name": "Ana Costa",
      "objective": "Aumentar vocabulário.",
      "activities": "Brincadeiras conjuntas.",
      "behavior": "Tranquilo e focado.",
      "progress": "Muito bom.",
      "next_steps": "Continuar com fichas.",
      "released_to_family": false,
      "created_at": "2026-05-01T15:00:00Z",
      "updated_at": "2026-05-01T15:00:00Z"
    }
  ]
}
```

**Permissions:** Therapists and Admins only

---

### List Evolutions Released to Family
Get a list of evolutions released for family viewing.

**Endpoint:**
```
GET /api/evolutions/family/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200) - Paginated:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "session": 1,
      "session_details": {...},
      "session_date": "2026-04-21",
      "therapist_name": "Ana Costa",
      "author_name": "Ana Costa",
      "objective": "Aumentar vocabulário.",
      "activities": "Brincadeiras conjuntas.",
      "behavior": "Tranquilo e focado.",
      "progress": "Muito bom.",
      "next_steps": "Continuar com fichas.",
      "released_to_family": true,
      "created_at": "2026-05-01T15:00:00Z",
      "updated_at": "2026-05-01T15:00:00Z"
    }
  ]
}
```

**Pagination:**
- `count`: Total records
- `results`: Array with current page data
- `next`/`previous`: Links to next/previous page (null if none)

**Filters:**
- Only returns evolutions where `released_to_family: true`
- Sorted by `created_at` (most recent first)

**Permissions:** Family members only

---

### Evolution Details (Family)
Get details of a specific evolution released to the guardian.

**Endpoint:**
```
GET /api/evolutions/family/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "session": 1,
  "session_details": {...},
  "session_date": "2026-04-21",
  "therapist_name": "Ana Costa",
  "author_name": "Ana Costa",
  "objective": "Aumentar vocabulário.",
  "activities": "Brincadeiras conjuntas.",
  "behavior": "Tranquilo e focado.",
  "progress": "Muito bom.",
  "next_steps": "Continuar com fichas.",
  "released_to_family": true,
  "created_at": "2026-05-01T15:00:00Z",
  "updated_at": "2026-05-01T15:00:00Z"
}
```

**Response (404):**
```json
{
  "detail": "Evolução não encontrada ou não autorizada."
}
```

**Validations:**
- The evolution must have `released_to_family: true`
- The patient's guardian email (guardian_email) must match the logged-in user's email

**Permissions:** Family members only

---

### Details and Editing
`GET/PUT/DELETE /api/evolutions/{id}/`

**PUT Request (update evolution):**
```json
{
  "objective": "Novo objetivo...",
  "released_to_family": true
}
```

---

## 🔐 Roles and Permissions

### Available Roles

| Role | Description | Permissions |
|------|-----------|-----------|
| **admin** | Administrator | Full access to all endpoints |
| **therapist** | Therapist | CRUD patients, sessions, and evolutions |
| **family** | Family Member | View only (read) |

### Access by Endpoint

| Endpoint | Admin | Therapist | Family |
|----------|-------|-----------|--------|
| POST `/auth/login/` | ✅ | ✅ | ✅ |
| POST `/auth/refresh/` | ✅ | ✅ | ✅ |
| GET `/auth/me/` | ✅ | ✅ | ✅ |
| POST `/auth/logout/` | ✅ | ✅ | ✅ |
| GET `/therapists/` | ✅ | ✅ | ❌ |
| GET `/dashboard/` | ✅ | ✅ (Their data) | ❌ |
| GET `/patients/` | ✅ | ✅ | ❌ |
| GET `/patients/family/` | ❌ | ❌ | ✅ |
| POST `/patients/` | ✅ | ✅ | ❌ |
| GET `/patients/{id}/` | ✅ | ✅ | ❌ |
| PUT `/patients/{id}/` | ✅ | ✅ | ❌ |
| DELETE `/patients/{id}/` | ✅ | ✅ | ❌ |
| ALL `/sessions/` | ✅ | ✅ (Only theirs) | ❌ |
| ALL `/evolutions/` | ✅ | ✅ (Only theirs) | ❌ |
| GET `/evolutions/family/` | ✅ | ✅ | ✅ |
| GET `/evolutions/family/{id}/` | ❌ | ❌ | ✅ |

---

## 🛠️ Local Development

### Environment Setup

1. **Create virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Apply migrations:**
```bash
python manage.py migrate
```

4. **Create superuser (admin):**
```bash
python manage.py createsuperuser
```

5. **Run server:**
```bash
python manage.py runserver
```

---

## 📊 Dashboard

### Get Dashboard Metrics
Returns aggregated dashboard metrics for the authenticated user.

**Endpoint:**
```
GET /api/dashboard/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "today_sessions": [
    {
      "id": 1,
      "patient": {
        "id": 1,
        "name": "João Silva"
      },
      "therapist": {
        "id": 2,
        "username": "therapist1"
      },
      "date_time": "2026-05-04T14:00:00Z",
      "status": "completed",
      "notes": "Sessão realizada com sucesso"
    },
    {
      "id": 2,
      "patient": {
        "id": 3,
        "name": "Maria Santos"
      },
      "therapist": {
        "id": 2,
        "username": "therapist1"
      },
      "date_time": "2026-05-04T15:30:00Z",
      "status": "scheduled",
      "notes": ""
    }
  ],
  "active_patients": 12,
  "pending_evolutions": 3
}
```

**Field Description:**
- `today_sessions`: List of sessions scheduled for today, ordered by time
- `active_patients`: Total non-deleted patients in the system
- `pending_evolutions`: Total completed sessions without a recorded evolution

**Permissions:**
- **Therapists**: See only their sessions for today and their pending evolutions
- **Admins**: See all sessions for today and all pending evolutions in the system

**Validations:**
- Only authenticated users with role `therapist` or `admin` have access
- Returns `403 Forbidden` if the user does not have permission

---

---

## 🌱 Seed (Demo Data)

Endpoint to populate the database with demo data (users, patients, sessions, evolutions). Useful for development and preview environments.

**Endpoint:**
```
GET /api/seed/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Seed data inserted successfully."
}
```

**Permissions:** Admins only

---

**Status:** 🟢 Phases 1, 2, 3, and 4 Complete (Backend MVP Delivered)  
**Last updated:** 06/05/2026

---

## 🏥 Health Check

Endpoint for monitoring and health checks (load balancers, Render, etc).

**Endpoint:**
```
GET /api/health/
```

**Response (200):**
```json
{
  "status": "ok"
}
```

**Permissions:** Public (no authentication)

---

## 🚀 Deploy (Render)

### Required Environment Variables

| Variable | Description |
|----------|-----------|
| `SECRET_KEY` | Django secret key (required, no fallback) |
| `ALLOWED_HOSTS` | Allowed domains (required in production) |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins |
| `DATABASE_URL` | PostgreSQL connection URL |
| `DJANGO_ENV` | Environment (`local` or `production`) |
| `DEBUG` | Debug mode (`True` only in local) |

### Build
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

### Start
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

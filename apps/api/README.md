# API - Patient Management

Backend for the patient management application.
Built with Django and Django REST Framework.

## Objective

Provide an API for patient management, allowing creation, reading, and maintenance of clinical records.

This backend is part of a fullstack system with a Next.js frontend.

## Stack

- Python 3.x
- Django 5.x
- Django REST Framework
- gunicorn (production server)
- whitenoise (static files)
- SQLite (local environment) / PostgreSQL (production)

## How to run

1. Create virtual environment
```bash
python -m venv .venv
```
2. Activate virtual environment
```bash
source .venv/bin/activate
```
3. Install dependencies
```bash
pip install -r requirements.txt
```
4. Apply migrations
```bash
python manage.py migrate
```
5. Seed demo data (optional)
```bash
python manage.py seed                  # seed both clinics
python manage.py seed --clinic alpha   # seed only Alpha
python manage.py seed --clinic beta    # seed only Beta
```

6. Run server
```bash
python manage.py runserver
```

## API available at:

[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Superuser (admin)

Create admin user:

```bash
python manage.py createsuperuser
```

Access admin panel:

[http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

## Main Endpoints

### Authentication

- `POST /api/auth/login/` → Login (returns JWT tokens)
- `POST /api/auth/refresh/` → Refresh token
- `GET /api/auth/me/` → Current user data
- `POST /api/auth/logout/` → Logout

### Therapists

- `GET /api/therapists/` → List active therapists

### Patients

- `GET /api/patients/` → List all patients (paginated)
- `POST /api/patients/` → Create a patient
- `GET /api/patients/{id}/` → Patient details
- `PUT /api/patients/{id}/` → Update a patient
- `DELETE /api/patients/{id}/` → Delete a patient (soft delete, admin only)

### Sessions

- `GET /api/sessions/` → List sessions
- `POST /api/sessions/` → Create session
- `GET /api/sessions/{id}/` → Session details
- `PUT /api/sessions/{id}/` → Update session
- `DELETE /api/sessions/{id}/` → Delete session

### Evolutions

- `GET /api/evolutions/` → List evolutions (paginated)
- `POST /api/evolutions/` → Create evolution (after completed session)
- `GET /api/evolutions/{id}/` → Evolution details
- `PUT /api/evolutions/{id}/` → Update evolution
- `DELETE /api/evolutions/{id}/` → Delete evolution

### Dashboard

- `GET /api/dashboard/` → Dashboard statistics

### Family (guardian portal)

- `GET /api/patients/family/` → Patient linked to guardian email
- `GET /api/evolutions/family/` → Evolutions released to family
- `GET /api/evolutions/family/{id}/` → Released evolution detail

### System

- `POST /api/seed/` → Seed demo data (secret-based auth, not JWT)
- `GET /api/health/` → Health check (public)

## Multi-Tenant Architecture

Spectra uses **physical database isolation** per tenant:

- **Central database** (`'default'`): stores `Tenant` and `CustomUser` models shared across all tenants.
- **Per-tenant databases**: each clinic (Alpha, Beta) has its own SQLite database for `Patient`, `Session`, and `TherapeuticEvolution` models.
- **Tenant context**: `TenantMiddleware` decodes JWT, resolves the `Tenant`, registers the tenant database dynamically, and sets the context via `ContextVar` for the request lifecycle.
- **Router**: `TenantDatabaseRouter` in `core/router.py` directs central models to `'default'` and tenant models to the per-request tenant DB.
- **CustomUser scoping**: `CustomUser.objects` auto-filters by `tenant_id` via `TenantScopedManager`. Use `CustomUser.all_objects` to bypass scoping (login, seed).

### Cross-Database FK Fields

`Session.therapist` and `TherapeuticEvolution.created_by` reference `CustomUser` in the central DB. They use `db_constraint=False` and must be traversed via `_id` comparisons or `prefetch_cross_db_fks()`.

## Patient Model Structure

- `id`
- `name`
- `birth_date`
- `guardian_name`
- `guardian_email`
- `notes`
- `created_at`
- `updated_at`
- `is_deleted` (soft delete — not exposed in API responses)
- `deleted_at` (soft delete timestamp)

## Database Configuration

### Environment Variables

The project uses `django-environ` and `dj-database-url` for database configuration.

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | **REQUIRED** - Django secret key | - |
| `DEBUG` | Debug mode (`True` or `False`) | `False` in production |
| `ALLOWED_HOSTS` | **REQUIRED in production** - Allowed domains | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `CENTRAL_DATABASE_URL` | Central DB connection (users, tenants) | `sqlite:///db.sqlite3` |
| `TENANT_DATABASE_URL` | Fallback tenant DB (placeholder) | - |
| `ALPHA_DB_URL` | Alpha clinic seed DB | `sqlite:///alpha.sqlite3` |
| `BETA_DB_URL` | Beta clinic seed DB | `sqlite:///beta.sqlite3` |
| `DJANGO_ENV` | Execution environment (`local` or `production`) | `local` |
| `SEED_SECRET` | Secret key for `/api/seed/` endpoint | - |

### Local Development (SQLite)

Three SQLite databases are used in development:

- `db.sqlite3` — central (tenants, users)
- `alpha.sqlite3` — Alpha clinic (patients, sessions, evolutions)
- `beta.sqlite3` — Beta clinic (patients, sessions, evolutions)

### Production (PostgreSQL)

Set the database URL variables in the `.env.production` file:

```bash
CENTRAL_DATABASE_URL=postgresql://user:password@host:5432/central_db
ALPHA_DB_URL=postgresql://user:password@host:5432/alpha_db
BETA_DB_URL=postgresql://user:password@host:5432/beta_db
```

### Seeding Data

```bash
python manage.py seed                  # seed both clinics
python manage.py seed --clinic alpha   # seed only Alpha
python manage.py seed --clinic beta    # seed only Beta
```

## Notes

- Project in MVP phase
- SQLite used only for local development
- Production uses PostgreSQL with separate databases per tenant

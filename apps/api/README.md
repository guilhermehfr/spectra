# API - Patient Management

Backend for the patient management application.
Built with Django and Django REST Framework.

## Objective

Provide an API for patient management, allowing creation, reading, and maintenance of basic records.

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
python manage.py seed
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

- `GET /api/patients/` → List all patients
- `POST /api/patients/` → Create a patient
- `GET /api/patients/{id}/` → Patient details
- `PUT /api/patients/{id}/` → Update a patient
- `DELETE /api/patients/{id}/` → Delete a patient (soft delete)

### Sessions

- `GET /api/sessions/` → List sessions (therapist sees their own)
- `POST /api/sessions/` → Create session
- `GET /api/sessions/{id}/` → Session details
- `PUT /api/sessions/{id}/` → Update session
- `DELETE /api/sessions/{id}/` → Delete session

### Evolutions

- `GET /api/evolutions/` → List evolutions
- `POST /api/evolutions/` → Create evolution (after completed session)
- `GET /api/evolutions/{id}/` → Evolution details
- `PUT /api/evolutions/{id}/` → Update evolution

### Dashboard

- `GET /api/dashboard/` → Dashboard statistics

### Family (guardian portal)

- `GET /api/patients/family/` → Patient linked to email
- `GET /api/evolutions/family/` → Evolutions released to family
- `GET /api/evolutions/family/{id}/` → Released evolution detail

### System

- `GET /api/seed/` → Seed demo data (admin only)
- `GET /api/health/` → Health check (for load balancers)

## Patient Model Structure

- `id`
- `name`
- `birth_date`
- `guardian_name`
- `guardian_email`
- `notes`
- `created_at`

## Database Configuration

### Environment Variables

The project uses `django-environ` and `dj-database-url` for database configuration.

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | **REQUIRED** - Django secret key | - |
| `DEBUG` | Debug mode (`True` or `False`) | `False` in production |
| `ALLOWED_HOSTS` | **REQUIRED in production** - Allowed domains | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `DATABASE_URL` | Full connection string (format: `postgresql://user:password@host:port/dbname`) | `postgresql://user:pass@localhost:5432/mydb` |
| `DJANGO_ENV` | Execution environment (`local` or `production`) | `local` |

### Local Development (SQLite)

By default, without `DATABASE_URL`, the project uses SQLite:

```bash
# Don't set DATABASE_URL = uses SQLite automatically
```

### Production (PostgreSQL)

Set the `DATABASE_URL` variable in the `.env.production` file:

```bash
DATABASE_URL=postgresql://user:password@host:5432/db_name
```

Or copy the example file:
```bash
cp .env.production.example .env.production
# Edit the file with your PostgreSQL database credentials
```

## Notes

- Project in MVP phase
- SQLite used only for local development
- Production uses PostgreSQL with DATABASE_URL

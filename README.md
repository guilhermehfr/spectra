<div align="center">


# 🧩 Spectra - ASD Clinic Management Platform

[![Vercel Status](https://therealsujitk-vercel-badge.vercel.app/?app=spectratea)](https://spectratea.vercel.app)
[![Render](https://img.shields.io/badge/render-live-brightgreen?style=flat&logo=render&logoColor=white)](https://ai-powered-webhook-handler-generator.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A full-stack clinical operations platform designed for Autism Spectrum Disorder (ASD) therapy clinics.

Spectra centralizes patient management, therapy scheduling, clinical progress tracking, and guardian communication workflows into a single system.

**Backend:** Django 5 · Django REST Framework · PostgreSQL  
**Frontend:** Next.js 16 · React 19 · TypeScript

🌐 _[Leia em Português](README-pt-br.md)_

<img width="700" height="400" alt="hero" src="https://github.com/user-attachments/assets/a3a3789b-4e39-427a-8347-6b6524350b97" />

[Live App](https://spectratea.vercel.app) · [Landing Page](https://spectra-tea.vercel.app) 

---

</div>

## 🚀 Demo Access (Recommended)

To explore the platform instantly without setup, acess:

Live App: https://spectratea.vercel.app

And use the credentials below to login:

### Clinic 1

| Role      | Email            | Password |
| --------- | ---------------- | -------- |
| Admin     | admin@alpha.com  | alpha    |
| Therapist | ana@alpha.com    | alpha    |
| Therapist | carlos@alpha.com | alpha    |
| Family    | maria@alpha.com  | alpha    |

### Clinic 2

| Role      | Email              | Password |
| --------- | ------------------ | -------- |
| Admin     | admin@beta.com     | beta     |
| Therapist | beatriz@beta.com   | beta     |
| Therapist | marcos@beta.com    | beta     |
| Family    | lucia@beta.com     | beta     |

---

## ✨ Overview

Spectra was built around real multidisciplinary therapy workflows.

The platform provides operational tooling for clinics while also delivering a dedicated family-facing experience for guardians to follow patient progress.

Instead of focusing only on administrative CRUD operations, Spectra models the actual workflow between therapists, sessions, clinical evolutions, and family communication.

Core workflows include:

- Patient and guardian management
- Therapy session scheduling
- Clinical progress note registration
- Therapist-controlled visibility permissions
- Guardian-facing follow-up portal
- Role-based operational access

## 🩺 Workflow

```txt
Therapist schedules session
            ↓
Session is completed
            ↓
Clinical evolution is registered
            ↓
Guardian receives access through Family Portal
```

## ✨ Features

### Clinic Backoffice

- Patient records with guardian information
- Weekly therapy scheduling
- Session management and rescheduling
- Clinical evolution registration
- Real-time dashboard statistics
- Therapist-controlled family visibility

### Family Portal

- Mobile-first guardian experience
- Released evolution history
- Session progress tracking
- Simplified and accessible interface

### Platform Infrastructure

- JWT authentication with httpOnly cookies
- Role-based access control
- Environment-aware API abstraction
- MSW-powered centralized mock infrastructure
- Lazy-loaded API implementations
- Monorepo architecture with pnpm workspaces

---

## 🏗 Architecture Highlights

- Multi-portal architecture (`clinic` and `family`)
- Server-first Next.js App Router architecture
- Environment-based API switching (`mock` ↔ `real`)
- Centralized in-memory mock state with MSW
- Internationalization (PT-BR / EN) with next-intl
- Role-aware middleware authentication
- Lazy-loaded API implementations
- Shared domain-driven component structure
- JWT auth flow with secure cookies

The mock infrastructure allows frontend development to proceed independently from backend availability while maintaining consistent application behavior.

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
| --- | --- |
| [Django](https://www.djangoproject.com/) | Backend framework |
| [Django REST Framework](https://www.django-rest-framework.org/) | REST API |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Neon](https://neon.tech/) | Serverless PostgreSQL |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) | JWT authentication |
| [Gunicorn](https://gunicorn.org/) | Production server |
| [Ruff](https://docs.astral.sh/ruff/) | Python linter and formatter |

### Frontend

| Technology | Purpose |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | React framework |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [MSW](https://mswjs.io/) | Mock API infrastructure |
| [next-intl](https://next-intl.dev/) | Internationalization (PT-BR / EN) |

### Infrastructure

| Technology | Purpose |
| --- | --- |
| [Vercel](https://vercel.com/) | Frontend deployment |
| [Render](https://render.com/) | Backend deployment |
| [pnpm](https://pnpm.io/) | Monorepo package management |

---

## 📁 Project Structure

```txt
spectra/
├── apps/
│   ├── api/                  # Django backend
│   │   ├── core/
│   │   ├── config/
│   │   └── manage.py
│   └── web/                  # Next.js frontend
│       ├── messages/          # Translation files (en.json, pt-BR.json)
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── i18n/
│       │   ├── lib/
│       │   └── mocks/
│       └── package.json
│
├── pnpm-workspace.yaml
├── .github/workflows/       # CI workflows
└── README.md
```

Mock accounts are available out of the box. See [Mock Accounts](#-mock-accounts) for credentials.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [pnpm](https://pnpm.io/)

---

## ⚙️ Backend Setup

```bash
cd apps/api

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp .env.local.example .env.local
# Ensure ALPHA_DB_URL and BETA_DB_URL are set to valid values (default: sqlite:///alpha.sqlite3 and sqlite:///beta.sqlite3)

python manage.py migrate
python manage.py seed                  # seed both clinics
python manage.py seed --clinic alpha   # seed only Alpha
python manage.py seed --clinic beta    # seed only Beta

python manage.py runserver
```

API available at:

```txt
http://127.0.0.1:8000
```

---

## 💻 Frontend Setup

```bash
cd apps/web

pnpm install

cp .env.local.example .env.local

pnpm dev
```

App available at:

```txt
http://localhost:3000
```

---

## ⚙️ Environment Variables

### Backend (`apps/api/.env`)

| Variable | Description |
| --- | --- |
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Debug mode |
| `CENTRAL_DATABASE_URL` | Central PostgreSQL connection string (users, tenants) |
| `TENANT_DATABASE_URL` | Fallback tenant DB (placeholder, ignored if set) |
| `ALPHA_DB_URL` | Alpha clinic seed DB (SQLite for dev) |
| `BETA_DB_URL` | Beta clinic seed DB (SQLite for dev) |
| `ALLOWED_HOSTS` | Allowed hosts |
| `CORS_ALLOWED_ORIGINS` | Frontend origins |
| `DJANGO_ENV` | Environment (`local` or `production`) |
| `SEED_SECRET` | Secret for `/api/seed/` endpoint |

### Frontend (`apps/web/.env.local`)

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_DISABLE_MSW` | Toggle mock infrastructure | `false` |
| `NEXT_PUBLIC_MOCK_USER_ID` | Default mock user (admin) | `1` |

---

## 👥 Mock Accounts

### Mock Mode (`NEXT_PUBLIC_DISABLE_MSW=false`)

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@alpha.com | any |
| Therapist | ana@alpha.com | any |
| Therapist | carlos@alpha.com | any |
| Family | maria@alpha.com | any |

---

## 🔐 Access Model

| Role | Permissions |
| --- | --- |
| `admin` | Full clinic access |
| `therapist` | Patients, sessions, evolutions |
| `family` | Read-only access to released evolutions |

---

## 📡 API Domains

Full API reference: [`apps/api/API_DOCUMENTATION.md`](apps/api/API_DOCUMENTATION.md)

Main API domains:

- Authentication
- Patients
- Sessions
- Clinical Evolutions
- Dashboard Analytics
- Family Portal Access
- Seed (Demo Data Population)

---

## 👋 Team

| Members | LinkedIn | GitHub |
|-|----------|--------|
| Guilherme Henrique | [guilhermehe](https://linkedin.com/in/guilhermehe) | [guilhermehfr](https://github.com/guilhermehfr) |
| Eduardo Oliveira | [eduardo-oliveira7](https://linkedin.com/in/eduardo-oliveira7) | [Edu-oliveira7](https://github.com/Edu-oliveira7) |
| Yuri Domingues | [domingues-yuri](https://linkedin.com/in/domingues-yuri) | [yuridomingues](https://github.com/yuridomingues) |
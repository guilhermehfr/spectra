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

[Live App](https://spectratea.vercel.app) · [Demo App](https://spectraclinic-demo.vercel.app) · [Landing Page](https://spectra-tea.vercel.app) 

---

</div>

## 🚀 Demo Access (Recommended)

To explore the platform instantly without setup:

Live Demo: https://spectraclinic-demo.vercel.app

### Quick Login

Use the credentials below directly in the application:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@spectra.com | admin123 |
| Therapist | ana@spectra.com | therapist123 |
| Therapist | carlos@spectra.com | therapist123 |
| Family | maria@gmail.com | family123 |

➡️ You can also jump directly to the local developement credentials section: [Mock Accounts](#-mock-accounts)

> The demo runs using the a separate dataset and API seeded service, ensuring identical behavior between environments.

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
│   │
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
└── README.md
```

Mock accounts are available out of the box. See [Mock Accounts](#-mock-accounts) for credentials.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.11+
- [pnpm](https://pnpm.io/)

---

## ⚙️ Backend Setup

```bash
cd apps/api

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp .env.local.example .env.local

python manage.py migrate
python manage.py seed

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
| `DATABASE_URL` | PostgreSQL connection string |
| `ALLOWED_HOSTS` | Allowed hosts |
| `CORS_ALLOWED_ORIGINS` | Frontend origins |

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
| Admin | admin@spectra.com | any |
| Therapist | ana@spectra.com | any |
| Therapist | carlos@spectra.com | any |
| Family | maria@gmail.com | any |

> Run `python manage.py seed` to populate mock accounts in the selected API DB.

---

## 🔐 Access Model

| Role | Permissions |
| --- | --- |
| `admin` | Full clinic access |
| `therapist` | Patients, sessions, evolutions |
| `family` | Read-only access to released evolutions |

---

## 📡 API Domains

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
# Spectra — Agent Guidelines

## Overview

Monorepo (`pnpm workspace`) with two apps under `apps/`:

- **`apps/api`** — Django 5.2 + DRF backend (multi-tenant)
- **`apps/web`** — Next.js 16 + React 19 frontend

## Agent Rules

### API (`apps/api`)

- **Python linter**: Ruff (`rtk ruff check apps/api`)
- **Multi-tenant**: Physical database isolation per tenant via `TenantDatabaseRouter`. Central models (Tenant, CustomUser) live in `'default'` DB, tenant-scoped models (Patient, Session, TherapeuticEvolution) use per-request tenant DB.
- **Tenant context**: Managed by `TenantMiddleware` via `ContextVar` (`core/tenant_context.py`). Middleware decodes JWT, resolves `Tenant`, registers DB, sets context, clears after response.
- **CustomUser scoping**: `CustomUser.objects` auto-filters by `tenant_id` via `TenantScopedManager`. Use `CustomUser.all_objects` to bypass scoping (login, seed).
- **Cross-DB FKs**: `Session.therapist`, `TherapeuticEvolution.created_by` use `db_constraint=False`. FK traversal uses `_id` comparisons + `prefetch_cross_db_fks()`.
- **Seed**: `python manage.py seed [--clinic alpha|beta]` — omit `--clinic` to seed both.
- **Env vars**: `CENTRAL_DATABASE_URL` (default/central DB), `TENANT_DATABASE_URL` (fallback placeholder), `ALPHA_DB_URL`/`BETA_DB_URL` (per-tenant seed DBs).

### Web (`apps/web`)

See `apps/web/AGENTS.md` for full frontend guidelines.

### Root Commands

- `pnpm dev` — starts both API (`apps/api`) and web (`apps/web`) via concurrently
- `pnpm lint` — runs Ruff on API + ESLint on web

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.

<!-- END:nextjs-agent-rules -->

# Spectra Web App - Agent Guidelines

## Project State

**Framework**: Next.js 16.2.4 with React 19.2.4 and TypeScript 5
**Architecture**: App Router (no `src/` folder - files directly in `app/`)
**Styling**: Tailwind CSS 4 with `@tailwindcss/postcss` (use `@import "tailwindcss"` syntax, not `tailwind.config.js`)
**Fonts**: Geist Sans & Mono via `next/font/google`

## Key Conventions

### File Structure

```
app/
├── layout.tsx          # Root layout with metadata
├── page.tsx            # Home page
├── globals.css         # Tailwind imports + CSS variables
└── patients/
    └── page.tsx        # Feature pages
```

### Components

- **React Server Components by default** - pages are async functions
- Client components: only when interactivity needed (add `'use client'`)
- No src/ folder - components live in app/ or create component folders as needed

### Data Fetching

- Server-side fetching in page components using Next.js `fetch`
- Use `cache: "no-store"` for dynamic data
- API calls to Django backend via `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)

### API Mocking (Development)

- **MSW v2.14.2** integrated via `instrumentation-client.ts`
- Auto-activates in `NODE_ENV=development`
- Mock handlers in `mocks/handlers.ts`
- Mock data in `mocks/data/` (users, patients, sessions, evolutions)

### Environment

- `.env.local` - local development
- `.env.production` - production build
- Both have `.example` versions

## Domain Context

**Spectra**: Therapy management system for patients with TEA (Autism Spectrum Disorder)

**User Roles**:

- `admin` - Full access
- `therapist` - Manages sessions and evolutions
- `family` - Views released evolutions

**Data Conventions**:

- Soft deletes via `is_deleted` flag
- Brazilian Portuguese in UI/mock data
- ISO 8601 date strings
- In-memory MSW state with incremental IDs

## Development

**Commands** (run from `apps/web/`):

- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm lint` - ESLint checks

**Config Files**:

- `next.config.ts` - TypeScript-based Next.js config
- `tsconfig.json` - Path aliases: `@/*` maps to `./*`
- `eslint.config.mjs` - Next.js core web vitals + TypeScript rules
- `postcss.config.mjs` - Tailwind CSS 4 plugin

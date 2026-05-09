<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.

<!-- END:nextjs-agent-rules -->

# Spectra Web App - Agent Guidelines

## Project State

**Framework**: Next.js 16.2.4 with React 19.2.4 and TypeScript 5
**Architecture**: App Router with `src/` folder for all application code
**Styling**: Tailwind CSS 4 with `@tailwindcss/postcss` (use `@import "tailwindcss"` syntax, not `tailwind.config.js`)
**Fonts**: Manrope & DM Sans via `next/font/google`
**Formatting**: Prettier 3.x with ESLint integration

## Key Conventions

### File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   ├── globals.css             # Tailwind imports + CSS variables
│   ├── middleware.ts           # Auth middleware
│   ├── actions/                # Server Actions
│   │   ├── auth.ts             # Authentication actions
│   │   ├── patient.ts          # Patient CRUD actions
│   │   ├── session.ts          # Session CRUD actions
│   │   └── evolution.ts        # Evolution CRUD actions
│   ├── login/
│   │   ├── clinic/page.tsx     # Clinic staff login
│   │   └── family/page.tsx     # Family login
│   ├── clinic/                 # Clinic portal routes
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Clinic dashboard
│   │   ├── patients/
│   │   │   ├── page.tsx        # Patients list
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Add new patient
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Patient detail
│   │   │       └── edit/
│   │   │           └── page.tsx     # Edit patient
│   │   ├── sessions/
│   │   │   ├── page.tsx          # Sessions list
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Schedule new session
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Session detail
│   │   │       ├── edit/
│   │   │       │   └── page.tsx    # Edit session
│   │   │       └── evolution/
│   │   │           └── page.tsx    # Create/view evolution for session
│   │   └── evolutions/
│   │       ├── new/
│   │       │   └── page.tsx      # New evolution
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx  # Edit evolution
│   └── family/                 # Family portal routes
│       ├── dashboard/
│       │   └── page.tsx        # Family dashboard
│       └── evolutions/
│           ├── page.tsx        # List all evolutions
│           └── [id]/
│               └── page.tsx      # View evolution
├── components/
│   ├── auth/                   # Login form components
│   │   ├── index.ts             # Barrel export
│   │   ├── BaseLoginForm.tsx   # Shared login form (use for new portals)
│   │   ├── LoginForm.tsx       # Main login form component
│   │   └── FamilyLoginForm.tsx
│   ├── layout/
│   │   ├── clinic/
│   │   │   ├── Layout.tsx       # Main clinic layout wrapper
│   │   │   ├── Navbar.tsx       # Top navigation bar
│   │   │   ├── SearchBar.tsx    # Patient search input
│   │   │   ├── Sidebar.tsx      # Sidebar container
│   │   │   ├── SidebarHeader.tsx# Sidebar header
│   │   │   ├── SidebarNav.tsx   # Sidebar navigation
│   │   │   ├── SidebarFooter.tsx# Sidebar footer
│   │   │   ├── UserAvatar.tsx   # User initials avatar
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── family/
│   │       ├── Navbar.tsx       # Family navigation
│   │       ├── Header.tsx       # Family header
│   │       ├── index.ts
│   │       └── types.ts
│   └── ui/
│       ├── clinic/              # Clinic-specific UI components
│       │   ├── DashboardContent.tsx
│       │   ├── DashboardStats.tsx
│       │   ├── WeeklyChart.tsx
│       │   ├── PatientsContent.tsx
│       │   ├── PatientsTable.tsx
│       │   ├── PatientsPageHeader.tsx
│       │   ├── PatientDetailContent.tsx
│       │   ├── PatientDetailHeader.tsx
│       │   ├── PatientInfoCard.tsx
│       │   ├── PatientSessionsSection.tsx
│       │   ├── PatientEvolutionsSection.tsx
│       │   ├── PatientForm.tsx
│       │   ├── PaginationNav.tsx
│       │   ├── SessionsContent.tsx   # Sessions list page wrapper
│       │   ├── SessionsTable.tsx     # Sessions table component
│       │   ├── SessionForm.tsx       # Session create/edit form
│       │   ├── EvolutionForm.tsx    # Evolution create/edit form
│       │   └── index.ts
│       ├── family/
│       │   ├── DashboardStats.tsx
│       │   ├── LatestEvolutionCard.tsx
│       │   ├── TherapistCard.tsx    # Therapist info display
│       │   ├── EvolutionSection.tsx # Evolution list section
│       │   └── EvolutionCard.tsx     # Evolution card component
│       └── shared/             # Reusable UI components
│           ├── index.ts            # Barrel export
│           ├── Avatar.tsx
│           ├── Button.tsx
│           ├── Input.tsx
│           ├── InputField.tsx     # Form input with label
│           ├── SelectField.tsx    # Form select dropdown
│           ├── TextareaField.tsx  # Form textarea
│           ├── BaseForm.tsx       # Base form wrapper
│           ├── Container.tsx
│           └── IconButton.tsx
├── lib/
│   ├── api/
│   │   ├── http.ts             # HTTP client setup
│   │   ├── clinic.ts           # Clinic API dispatcher (lazy-load)
│   │   ├── clinic-mock.ts      # Clinic mock implementation
│   │   ├── clinic-real.ts      # Clinic real implementation
│   │   ├── family.ts           # Family API dispatcher (lazy-load)
│   │   ├── family-mock.ts     # Family mock implementation
│   │   └── family-real.ts     # Family real implementation
│   ├── types.ts                # Shared TypeScript types
│   ├── auth.ts                 # Real auth implementation (HTTP)
│   ├── auth-mock.ts            # Mock auth implementation
│   ├── authService.ts          # Unified auth service (switches by env)
│   ├── authResolver.ts         # Resolves user identity from request
│   └── utils/                  # Utility functions
│       │   ├── index.ts        # Barrel export for all utilities
│       │   ├── dateUtils.ts    # getRelativeDate() - relative date formatting in Portuguese
│       │   ├── stringUtils.ts  # extractInitials() - name to initials conversion
│       │   ├── userUtils.ts    # resolveUser(), resolveUserWithRole()
│       │   ├── greetingUtils.ts# getGreeting()
│       │   ├── dateRangeUtils.ts# getTodayRange(), getDaysAgo(), aggregateByDayOfWeek()
│       │   ├── statsUtils.ts   # calculateClinicStats(), filterRecentSessions()
│       │   ├── envUtils.ts     # getUseMock()
│       │   └── redirectUtils.ts# getDashboardUrl(), getLoginUrl()
└── mocks/
    ├── browser.ts              # MSW browser worker setup
    ├── state.ts                # Centralized in-memory mock state
    ├── handlers.ts             # Mock request handlers
    └── data/                   # Mock data files
        ├── users.ts
        ├── patients.ts
        ├── sessions.ts
        └── evolutions.ts
```

### Components

- **React Server Components by default** - pages are async functions
- Client components: only when interactivity needed (add `'use client'`)
- Components organized in `src/components/` by domain (auth, layout, ui)

### Authentication

- **AuthService**: Use `authService` from `@/lib/authService` for all auth operations
  - `authService.login(credentials)` - Login user
  - `authService.me()` - Get current user info
  - `authService.logout()` - Logout user
- **AuthResolver**: Use `authResolver` from `@/lib/authResolver` for user identity resolution
  - `authResolver.getUser(cookieValue)` - Resolves user from cookie
- **Switch by environment**: Set `NEXT_PUBLIC_DISABLE_MSW=false` to use mock (default in dev), `true` for real API
- **Cookie**: `access_token` stores JWT token after login (not user ID)
- **HTTP Authorization**: All API calls automatically include `Authorization: Bearer {token}` header via `src/lib/api/http.ts`
- **Logout**: Use `logoutAction` from `src/app/actions/auth.ts` to logout
- **Middleware**: `src/app/middleware.ts` handles auth checks on every route
- **Public routes**: `/`, `/login/*` bypass auth check
- **Protected routes**: All other routes require authentication
- **Redirects**:
  - Unauthenticated → `/login/clinic` or `/login/family` based on route
  - Authenticated on login → `/clinic/dashboard` or `/family/dashboard` based on role
- **User roles**: `admin`/`therapist` → clinic portal, `family` → family portal

### Preferred Patterns

**User Resolution in Pages**:

- Always use `resolveUser()` from `@/lib/utils/userUtils` instead of manual `headers()` + JSON parsing
- For role-protected pages, use `resolveUserWithRole(requiredRole)` which auto-redirects on failure

**Environment Checks**:

- Use `getUseMock()` from `@/lib/utils/envUtils` instead of inline `process.env.NEXT_PUBLIC_DISABLE_MSW`

**Role-Based Redirects**:

- Use `getDashboardUrl(role)` and `getLoginUrl(role)` from `@/lib/utils/redirectUtils`
- Example: `redirect(getDashboardUrl(user.role))`

**Login Forms**:

- New login portals should extend `BaseLoginForm` component
- Pass `subtitle` and optional `startIcon` props

**Component Imports (Barrel Exports)**:

- All component folders have barrel exports (`index.ts`) for cleaner imports
- Use barrel path instead of individual file paths:

  ```tsx
  // ✅ Correct - use barrel export
  import { Button, Container } from '@/components/ui/shared'
  import { ClinicLoginForm } from '@/components/auth'

  // ❌ Avoid - direct file import
  import { Button } from '@/components/ui/shared/Button'
  ```

- Barrel exports exist in: `auth/`, `layout/clinic/`, `layout/family/`, `ui/clinic/`, `ui/shared/`

**Creating New Utilities**:

- Put in `src/lib/utils/` with descriptive filename
- Export from `index.ts` barrel file
- Create when logic repeats in 2+ files

### Data Fetching

- Server-side fetching in page components using Next.js `fetch`
- Server Actions in `src/app/actions/` for form mutations
- Use `cache: "no-store"` for dynamic data
- API calls to Django backend via `process.env.NEXT_PUBLIC_API_URL` (default: `http://127.0.0.1:8000`)

### API Mocking (Development)

- **Centralized Mock State**: Use `src/mocks/state.ts` for all mock data (no fetch calls in mock mode)
- **Lazy-Load Architecture**: Mock/real implementations loaded dynamically based on `NEXT_PUBLIC_DISABLE_MSW`
- **MSW v2.14.2** integrated via `instrumentation-client.ts`
- Auto-activates in `NODE_ENV=development`
- Browser worker setup in `src/mocks/browser.ts`
- Mock handlers in `src/mocks/handlers.ts`
- Mock data in `src/mocks/data/` (users, patients, sessions, evolutions)

### Environment

- `.env.local` - local development (API URL: `http://127.0.0.1:8000`)
- `.env.production` - production build
- Both have `.example` versions
- `NEXT_PUBLIC_DISABLE_MSW=false` - Enable mock (MSW + auth) - default in dev
- `NEXT_PUBLIC_DISABLE_MSW=true` - Disable mock, use real API
- `NEXT_PUBLIC_MOCK_USER_ID` - Default user ID for mock (default: 1)

### Authentication

- **JWT Token Storage**: The access token returned from `/api/auth/login/` is stored in an `access_token` cookie
- **HTTP Client**: All API calls automatically include `Authorization: Bearer {token}` header via `src/lib/api/http.ts`
- **Cookie Configuration**: HttpOnly, secure in production, sameSite: lax, 7-day expiry
- **Logout**: Deletes the `access_token` cookie and calls `/api/auth/logout/`

**Auth Flow**:

1. User submits login form → `loginAction` in `src/app/actions/auth.ts`
2. Server calls `authService.login()` → receives JWT `access` token
3. Token stored in cookie → subsequent requests include Bearer token automatically
4. Middleware (`src/app/middleware.ts`) checks cookie existence only, redirects if missing
5. Pages fetch user info via `authService.me()` when needed

### Family Portal (Dashboard)

- **Stats Cards**: "Total de Evoluções" and "Última Evolução" with relative dates in Portuguese (Hoje, Ontem, Há 2 dias, etc.)
- **Avatar**: Patient initials with Spectra blue brand color
- **Evolution Card**: Shows latest evolution with therapist name prefixed "Terapeuta. "
- **Navbar**:
  - Mobile: Fixed at bottom, icons above text (flex-col)
  - Desktop: Fixed at top, icons beside text (flex-row)
- **Responsive Text**: Uses `text-xs md:text-sm`, `text-sm md:text-base`, etc. for mobile/desktop

### Clinic Portal (Dashboard)

- **Layout**: Sidebar-based layout with header, navigation, and footer
- **Sidebar**: Fixed left sidebar with navigation links (Dashboard, Pacientes, Sessões)
- **Navigation**: Active state styling with gradient blue indicator
- **Top Navbar**: Sticky navbar with search bar and user avatar
  - `ClinicSearchBar.tsx` - Search input for patients
  - `ClinicUserAvatar.tsx` - User initials avatar display
- **User Header**: Uses `authService.me()` to fetch user data for authentication context

## Domain Context

**Spectra**: Therapy management system for patients with TEA (Autism Spectrum Disorder)

**User Roles**:

- `admin` - Full access
- `therapist` - Manages sessions and evolutions
- `family` - Views released evolutions

**Portals**:

- **Clinic Portal** (`/clinic/*`) - For admin and therapist users
- **Family Portal** (`/family/*`) - For family users to view evolutions

**Data Conventions**:

- Soft deletes via `is_deleted` flag
- Brazilian Portuguese in UI/mock data
- ISO 8601 date strings
- In-memory mock state with incremental IDs

## Development

**Commands** (run from `apps/web/`):

- `pnpm dev` - Development server (uses Turbopack)
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - ESLint checks
- `pnpm format` - Prettier + ESLint auto-fix

**Config Files**:

- `next.config.ts` - TypeScript-based Next.js config (with `cacheComponents: true` and security headers)
- `tsconfig.json` - Path aliases: `@/*` maps to `./src/*`
- `eslint.config.mjs` - Next.js core web vitals + TypeScript rules + Prettier
- `postcss.config.mjs` - Tailwind CSS 4 plugin
- `.prettierrc` / `.prettierignore` - Prettier formatting config

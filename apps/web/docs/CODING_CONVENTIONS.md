# Spectra Web App - Coding Conventions

This document outlines the project's established patterns and best practices. These conventions ensure consistency across the codebase and enable efficient collaboration.

## Core Principles

1. **Server Components by Default** - Use React Server Components (async functions) unless client-side interactivity is required
2. **Explicit Over Implicit** - Use named imports and explicit types rather than relying on inference
3. **Utilities Over Duplication** - Extract repeated logic into utilities after it appears in 2+ locations
4. **Consistent Styling** - Follow Tailwind CSS 4 patterns established in the codebase
5. **Brazilian Portuguese** - UI text and user-facing content in pt-BR

---

## Authentication & User Resolution

### ✅ DO: Use Utilities

```tsx
// ✅ Correct - use resolveUser() utility
import { resolveUser } from '@/lib/utils/userUtils'

export default async function Page() {
  const user = await resolveUser()
  // ...
}
```

```tsx
// ❌ Avoid - manual cookie parsing
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  // ...
}
```

### Role-Based Redirects

```tsx
// ✅ Correct - use redirect utilities
import { redirect } from 'next/navigation'
import { getDashboardUrl, getLoginUrl } from '@/lib/utils/redirectUtils'

// After login
redirect(getDashboardUrl(user.role))

// On logout
redirect(getLoginUrl(user.role))
```

---

## Environment Checks

### ✅ DO: Use getUseMock()

```tsx
// ✅ Correct
import { getUseMock } from '@/lib/utils/envUtils'

if (getUseMock()) {
  // use mock
}
```

```tsx
// ❌ Avoid - inline environment check
if (process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true') {
  // use mock
}
```

---

## Login Forms

### Creating New Login Portals

New login pages should extend the `BaseLoginForm` component:

```tsx
// components/auth/NewPortalLoginForm.tsx
'use client'

import { BaseLoginForm } from './BaseLoginForm'
import { CustomIcon } from 'lucide-react'

export function NewPortalLoginForm() {
  return (
    <BaseLoginForm
      subtitle="Portal description"
      startIcon={<CustomIcon size={25} className="text-blue-600" strokeWidth={2} />}
    />
  )
}
```

---

## Creating Utilities

### When to Create a Utility

Create a new utility function when:

- The same logic appears in 2+ files
- The function is domain-agnostic and reusable
- It encapsulates complex logic that deserves a name

### Utility File Structure

```
src/lib/utils/
├── index.ts          # Barrel export
├── dateUtils.ts      # Date formatting (getRelativeDate)
├── stringUtils.ts    # String manipulation (extractInitials)
├── userUtils.ts      # User resolution (resolveUser)
├── greetingUtils.ts  # Greeting generation (getGreeting)
├── dateRangeUtils.ts # Date range calculations
├── statsUtils.ts     # Dashboard statistics
├── envUtils.ts       # Environment checks (getUseMock)
└── redirectUtils.ts  # URL redirects (getDashboardUrl)
```

### Adding a New Utility

1. Create `src/lib/utils/newUtility.ts`
2. Export the function with clear name and JSDoc
3. Add to `src/lib/utils/index.ts` barrel export
4. Document in this file if it's a common pattern

---

## Component Organization

### Directory Structure

```
src/components/
├── auth/                    # Authentication components
│   ├── BaseLoginForm.tsx    # Shared base for login forms
│   ├── ClinicLoginForm.tsx
│   └── FamilyLoginForm.tsx
├── layout/
│   ├── clinic/              # Clinic layout components
│   │   ├── ClinicLayout.tsx
│   │   ├── ClinicSidebar.tsx
│   │   └── ...
│   └── family/              # Family layout components
└── ui/
    ├── clinic/              # Clinic-specific UI
    ├── family/              # Family-specific UI
    └── shared/              # Reusable UI components
        ├── Button.tsx
        ├── Input.tsx
        └── ...
```

### Naming Conventions

- **Components**: PascalCase (`ClinicLayout.tsx`)
- **Utilities**: camelCase (`extractInitials.ts`)
- **Types**: PascalCase with `type` suffix (`User`, `Patient`)
- **Files**: kebab-case (`base-login-form.tsx`)

---

## Page Pattern

### Standard Page Template

```tsx
// src/app/[portal]/[feature]/page.tsx
import { resolveUser } from '@/lib/utils/userUtils'
import { getGreeting } from '@/lib/utils/greetingUtils'
import { Layout } from '@/components/layout/portal'
import { ContentComponent } from '@/components/ui/portal'

export default async function FeaturePage() {
  const user = await resolveUser()

  // Fetch data
  const data = await fetchData()

  return (
    <Layout user={user}>
      <ContentComponent greeting={getGreeting(user.first_name)} data={data} />
    </Layout>
  )
}
```

---

## TypeScript Guidelines

### Import Types Explicitly

```tsx
// ✅ Explicit type import
import type { User, Patient, Session } from '@/lib/types'

// ✅ Using types
const user: User = { ... }
```

### Avoid `any`

```tsx
// ❌ Avoid
const data: any = fetchData()

// ✅ Prefer explicit types
const data: ApiResponse = fetchData()

// ✅ Or unknown with type narrowing
const data: unknown = fetchData()
if (isUser(data)) {
  /* ... */
}
```

---

## Soft Deletes

All entities use soft delete via `is_deleted` flag:

```tsx
// Filtering deleted items
const activePatients = patients.filter((p) => !p.is_deleted)

// Soft delete in mock state
export function deletePatient(id: number): boolean {
  const index = patients.findIndex((p) => p.id === id)
  if (index === -1) return false
  patients[index].is_deleted = true
  return true
}
```

---

## Error Handling

### Server Actions

```tsx
export async function action(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    // Operation
    redirect('/success')
  } catch (error) {
    const digest = (error as Error & { digest?: string }).digest
    if (digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Action failed: ', error)
    return { error: 'User-friendly error message' }
  }
}
```

---

## Testing Patterns (Development)

### Mock Data Relationships

```
Family User (maria@gmail.com)
    ↓
Patient (guardian_email=maria@gmail.com)
    ↓
Session (patient=1, status=completed)
    ↓
Evolution (session=1, released_to_family=true)
```

### Test Users

| Email              | Role      | Password | Portal |
| ------------------ | --------- | -------- | ------ |
| admin@spectra.com  | admin     | any      | clinic |
| ana@spectra.com    | therapist | any      | clinic |
| carlos@spectra.com | therapist | any      | clinic |
| maria@gmail.com    | family    | any      | family |

---

## Common Patterns Quick Reference

| Pattern                     | Use                       | Location                     |
| --------------------------- | ------------------------- | ---------------------------- |
| `resolveUser()`             | Get current user in pages | `@/lib/utils/userUtils`      |
| `resolveUserWithRole(role)` | Get user + validate role  | `@/lib/utils/userUtils`      |
| `getUseMock()`              | Check mock/real mode      | `@/lib/utils/envUtils`       |
| `getDashboardUrl(role)`     | Get dashboard by role     | `@/lib/utils/redirectUtils`  |
| `getLoginUrl(role)`         | Get login page by role    | `@/lib/utils/redirectUtils`  |
| `getRelativeDate(date)`     | Portuguese relative dates | `@/lib/utils/dateUtils`      |
| `extractInitials(name)`     | Get name initials         | `@/lib/utils/stringUtils`    |
| `getGreeting(firstName)`    | Generate greeting         | `@/lib/utils/greetingUtils`  |
| `calculateClinicStats()`    | Dashboard metrics         | `@/lib/utils/statsUtils`     |
| `aggregateByDayOfWeek()`    | Chart data                | `@/lib/utils/dateRangeUtils` |

---

## Related Documentation

- **AGENTS.md** - Project guidelines and conventions
- **COMPONENT_STRUCTURE.md** - Component creation guide
- **UTILITY_USAGE.md** - Utility patterns and examples
- **PAGE_TEMPLATE.md** - Standard page pattern reference
- **docs/mock/** - Mock implementation documentation

---

## Contributing to Conventions

When you find a pattern worth documenting:

1. Verify it works in 2+ locations
2. Create or update the utility
3. Export from `src/lib/utils/index.ts`
4. Add to this document
5. Update AGENTS.md if it's a key pattern

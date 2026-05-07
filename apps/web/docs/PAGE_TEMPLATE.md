# Spectra Web App - Page Template Guide

This guide provides standard patterns for creating new pages in the application.

---

## Standard Page Template

### Basic Dashboard Page

```tsx
// src/app/[portal]/dashboard/page.tsx
import { resolveUser } from '@/lib/utils/userUtils'
import { getGreeting } from '@/lib/utils/greetingUtils'
import { Layout } from '@/components/layout/portal'
import { DashboardContent } from '@/components/ui/portal'

export default async function DashboardPage() {
  // 1. Resolve user
  const user = await resolveUser()

  // 2. Fetch data
  const data = await fetchData()

  // 3. Compute derived data
  const stats = computeStats(data)

  // 4. Render
  return (
    <Layout user={user}>
      <DashboardContent greeting={getGreeting(user.first_name)} stats={stats} data={data} />
    </Layout>
  )
}
```

---

### List Page with Data Fetching

```tsx
// src/app/clinic/patients/page.tsx
import { resolveUser } from '@/lib/utils/userUtils'
import { ClinicLayout } from '@/components/layout/clinic'
import { ClinicPatientsContent } from '@/components/ui/clinic'
import { getPatients } from '@/lib/api/clinic'

export default async function PatientsPage() {
  // User resolution
  const user = await resolveUser()

  // Data fetching
  const allPatients = await getPatients()
  const activePatients = allPatients.filter((p) => !p.is_deleted)

  return (
    <ClinicLayout user={user}>
      <ClinicPatientsContent
        initialPatients={activePatients}
        totalCount={activePatients.length}
        isLoading={false}
      />
    </ClinicLayout>
  )
}
```

---

### Detail Page with Params

```tsx
// src/app/clinic/patients/[id]/page.tsx
import { notFound } from 'next/navigation'
import { resolveUser } from '@/lib/utils/userUtils'
import { ClinicLayout } from '@/components/layout/clinic'
import { PatientDetailContent } from '@/components/ui/clinic'
import { getPatient, getSessions, getEvolutions } from '@/lib/api/clinic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage({ params }: PageProps) {
  // Parse and validate params
  const { id } = await params
  const patientId = parseInt(id, 10)

  if (isNaN(patientId)) {
    notFound()
  }

  // User resolution
  const user = await resolveUser()

  // Fetch main entity
  const patient = await getPatient(patientId)
  if (!patient) {
    notFound()
  }

  // Fetch related entities
  const [allSessions, allEvolutions] = await Promise.all([getSessions(), getEvolutions()])

  // Filter related data
  const patientSessions = allSessions.filter((s) => s.patient === patientId && !s.is_deleted)
  const sessionIds = new Set(patientSessions.map((s) => s.id))
  const patientEvolutions = allEvolutions.filter((e) => sessionIds.has(e.session))

  return (
    <ClinicLayout user={user}>
      <PatientDetailContent
        patient={patient}
        sessions={patientSessions}
        evolutions={patientEvolutions}
      />
    </ClinicLayout>
  )
}
```

---

### Family Portal Page with Role Check

```tsx
// src/app/family/dashboard/page.tsx
import { resolveUserWithRole } from '@/lib/utils/userUtils'
import { getPatientByGuardianEmail } from '@/lib/api/clinic'
import { getFamilyEvolutions } from '@/lib/api/family'
import { FamilyNavbar } from '@/components/layout/family'
import { FamilyDashboardContent } from '@/components/ui/family'
import { getRelativeDate } from '@/lib/utils/dateUtils'
import { extractInitials } from '@/lib/utils/stringUtils'

export default async function FamilyDashboardPage() {
  // Role-protected user resolution (auto-redirects if not family)
  const user = await resolveUserWithRole('family')

  // Fetch patient by guardian email
  let patient = null
  try {
    patient = await getPatientByGuardianEmail(user.email)
  } catch {
    patient = null
  }

  // Handle missing patient
  if (!patient) {
    return (
      <div className="error-page">
        <h1>Paciente Não Encontrado</h1>
      </div>
    )
  }

  // Fetch evolutions
  let evolutions = []
  try {
    evolutions = await getFamilyEvolutions()
  } catch {
    evolutions = []
  }

  // Compute derived data
  const latestEvolution = evolutions[0] // sorted
  const patientInitials = extractInitials(patient.name)
  const lastSessionDate = latestEvolution?.session_date || null

  return (
    <div className="min-h-screen bg-[#EEF3FB]">
      <FamilyDashboardContent
        patientName={patient.name}
        patientInitials={patientInitials}
        guardianName={patient.guardian_name}
        totalSessions={evolutions.length}
        lastSessionRelative={lastSessionDate ? getRelativeDate(lastSessionDate) : 'Sem sessões'}
        latestEvolution={latestEvolution}
      />
      <FamilyNavbar />
    </div>
  )
}
```

---

## Page Checklist

When creating a new page, ensure:

- [ ] Import `resolveUser()` from `@/lib/utils/userUtils`
- [ ] Use appropriate Layout component
- [ ] Pass `user` prop to Layout
- [ ] Use async/await for data fetching
- [ ] Use `Promise.all()` for parallel fetches
- [ ] Filter `is_deleted` items for entities
- [ ] Handle null/missing data gracefully
- [ ] Use `notFound()` for invalid params
- [ ] Use `redirect()` for auth failures
- [ ] Follow responsive text patterns (`text-xs md:text-sm`)

---

## Common Layouts

### Clinic Layout

```tsx
import { ClinicLayout } from '@/components/layout/clinic'
;<ClinicLayout user={user}>
  <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:pt-24">{/* content */}</div>
</ClinicLayout>
```

### Family Layout

```tsx
import { FamilyNavbar } from '@/components/layout/family'
;<div className="min-h-screen bg-[#EEF3FB] pb-32 md:pb-0">
  {/* content */}
  <FamilyNavbar />
</div>
```

---

## Error Handling

### 404 for Not Found

```tsx
import { notFound } from 'next/navigation'

const entity = await getEntity(id)
if (!entity) {
  notFound()
}
```

### Error Boundary (Future)

```tsx
// Currently not implemented, but planned pattern
export default function PageWithErrorBoundary() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <PageContent />
    </ErrorBoundary>
  )
}
```

---

## Loading States

Currently pages don't implement loading states. Future pattern:

```tsx
// Planned pattern
import { Suspense } from 'react'
import { LoadingSkeleton } from '@/components/ui/shared'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PageContent />
    </Suspense>
  )
}
```

---

## SEO and Metadata

Add metadata to pages as needed:

```tsx
export const metadata = {
  title: 'Spectra - Dashboard',
  description: 'Painel de controle da clínica',
}
```

---

## Related Documentation

- **CODING_CONVENTIONS.md** - Project patterns
- **COMPONENT_STRUCTURE.md** - Component creation
- **UTILITY_USAGE.md** - Utility reference
- **AGENTS.md** - Agent guidelines

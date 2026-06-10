# Spectra Web App - Utility Usage Guide

This guide explains when and how to use existing utilities, and how to create new ones.

---

## When to Create a Utility

Create a new utility when:

1. **Duplication** - Same logic appears in 2+ files
2. **Reusability** - The function is domain-agnostic
3. **Complexity** - The logic deserves a descriptive name
4. **Testing** - The function can be unit tested independently

---

## Existing Utilities

### User Resolution (`src/lib/utils/userUtils.ts`)

```tsx
import { resolveUser, resolveUserWithRole } from '@/lib/utils/userUtils'

// Basic user resolution
const user = await resolveUser()

// Role-protected resolution (auto-redirects on failure)
const user = await resolveUserWithRole('family')
const user = await resolveUserWithRole('therapist') // or 'admin'
```

**Use in:** All page components that need user context

---

### Environment Checks (`src/lib/utils/envUtils.ts`)

```tsx
import { getUseMock } from '@/lib/utils/envUtils'

const isMockMode = getUseMock()
// Returns true when NEXT_PUBLIC_DISABLE_MSW !== 'true'
```

**Use in:** Any file that needs to know the current mode (API dispatchers, auth service, middleware)

---

### Redirect Utilities (`src/lib/utils/redirectUtils.ts`)

```tsx
import { getDashboardUrl, getLoginUrl, getLoginRedirectForPath } from '@/lib/utils/redirectUtils'

// Get dashboard based on role
const dashboard = getDashboardUrl('family') // '/family/dashboard'
const dashboard = getDashboardUrl('therapist') // '/clinic/dashboard'
const dashboard = getDashboardUrl('admin') // '/clinic/dashboard'

// Get login page based on role
const login = getLoginUrl('family') // '/login/family'
const login = getLoginUrl('clinic') // '/login/clinic'

// Get login redirect URL based on current path
const redirect = getLoginRedirectForPath('/clinic/patients') // '/login/clinic'
```

**Use in:** Server Actions, anywhere doing role-based redirects

---

### Date Utilities (`src/lib/utils/dateUtils.ts`)

```tsx
import {
  formatDate,
  formatDateShort,
  formatDateLong,
  formatDateTime,
  formatDateTimeISO,
  getRelativeDate,
} from '@/lib/utils/dateUtils'

// Accept optional locale param (default: 'pt-BR')
const label = getRelativeDate('2026-05-04', {
  today: 'Today',
  yesterday: 'Yesterday',
  daysAgo: '{days} days ago',
})
// Returns: "Hoje" (pt-BR) or "Today" (en)
const formatted = formatDate('2026-05-28') // Returns: "28/05/2026"
const formatted = formatDate('2026-05-28', 'en') // Returns: "05/28/2026"
const short = formatDateShort('2026-05-28') // Returns: "28/05"
const long = formatDateLong('2026-05-28') // Returns: "28 de maio de 2026"
const long = formatDateLong('2026-05-28', 'en') // Returns: "May 28, 2026"
const time = formatDateTime('2026-05-28T10:00:00Z') // Returns: "28/05/2026 10:00"
const iso = formatDateTimeISO('2026-05-28T10:00:00Z') // Returns: "2026-05-28T10:00:00"
```

**Use in:** Dashboard stats, session lists, anywhere displaying dates to users

---

### String Utilities (`src/lib/utils/stringUtils.ts`)

```tsx
import { extractInitials } from '@/lib/utils/stringUtils'

const initials = extractInitials('João Silva') // 'JS'
const initials = extractInitials('Maria') // 'MA'
const initials = extractInitials('Ana Carolina') // 'AC'
```

**Use in:** Avatar components, user/patient displays

---

### Greeting Utilities (`src/lib/utils/greetingUtils.ts`)

```tsx
import { getGreeting } from '@/lib/utils/greetingUtils'

// Accept optional t (translator function) — falls back to Portuguese
const greeting = getGreeting('Ana') // 'Olá, Ana'
const greeting = getGreeting('Ana', t) // localized via t('greeting', { name: 'Ana' })
const greeting = getGreeting('') // ''
```

**Use in:** Dashboard headers, welcome messages

---

### Date Range Utilities (`src/lib/utils/dateRangeUtils.ts`)

```tsx
import { getTodayRange, getDaysAgo, aggregateByDayOfWeek } from '@/lib/utils/dateRangeUtils'

// Get start/end of current day
const { start, end } = getTodayRange()
// Returns: { start: Date, end: Date }

// Get date N days ago
const weekAgo = getDaysAgo(7) // Date object

// Aggregate sessions by day of week for charts (accepts optional locale)
const chartData = aggregateByDayOfWeek(sessions) // Portuguese day labels
const chartData = aggregateByDayOfWeek(sessions, 'en') // English day labels
// Returns: [{ day: 'Dom', sessions: 0 }, { day: 'Seg', sessions: 2 }, ...]
```

**Use in:** Dashboard charts, date filtering, statistics

---

### Statistics Utilities (`src/lib/utils/statsUtils.ts`)

```tsx
import { calculateClinicStats, filterRecentSessions } from '@/lib/utils/statsUtils'

// Calculate dashboard metrics
const stats = calculateClinicStats(patients, sessions, evolutions)
// Returns: { activePatients, todaySessions, pendingEvolutions }

// Filter sessions by days
const recent = filterRecentSessions(allSessions, 7) // Last 7 days
```

**Use in:** Dashboard pages, statistics displays

---

### Permission Utilities (`src/lib/utils/permissionUtils.ts`)

```tsx
import {
  canEditSession,
  canDeleteSession,
  canEditEvolution,
  canDeleteEvolution,
  canReleaseEvolution,
} from '@/lib/utils/permissionUtils'

// Check if user can edit/delete a session
const canEdit = canEditSession(session, user)
const canDelete = canDeleteSession(session, user)

// Check if user can edit/delete/release an evolution
const canEdit = canEditEvolution(evolution, user)
const canDelete = canDeleteEvolution(evolution, user)
const canRelease = canReleaseEvolution(evolution, user)
```

**Use in:** Page authorization, component visibility

---

### Session Status Utilities (`src/lib/utils/sessionStatusUtils.ts`)

```tsx
import {
  normalizeSessionStatus,
  getSessionStatusDisplay,
  getStatusLabel,
  getStatusClassName,
} from '@/lib/utils/sessionStatusUtils'

// Accept optional t (translator function) — falls back to Portuguese labels
const normalized = normalizeSessionStatus('completed') // Returns: 'completed'

// Get display info for a status
const display = getSessionStatusDisplay('scheduled', t)
// Returns: { label: 'Scheduled' (en) or 'Agendada' (pt), className: '...' }

// Get label for session status
const label = getStatusLabel('completed', t) // Returns: 'Completed' or 'Concluída'

// Get CSS class name for status styling (no translation needed)
const className = getStatusClassName('scheduled') // Returns: 'bg-yellow-100 text-yellow-800'
```

**Use in:** Session tables, status badges, filtering

---

### Translation Utilities (`src/lib/utils/translationUtils.ts`)

```tsx
import { getServerT } from '@/lib/utils/translationUtils'

// In server actions — resolves locale from request context
const t = await getServerT()
return { error: t('Common.loginFailed') }
return { success: t('Common.saved') }
```

**Purpose:** Provides translation in server actions where `next-intl` request context may not be available.

**How it works:**

1. Tries `getMessages()` from `next-intl/server` (request-scoped cache)
2. Falls back to reading `locale` cookie + dynamic import of message file

**Use in:** All server action files (`src/app/actions/`)

---

## Creating a New Utility

### Step 1: Choose the Right Location

All utilities go in `src/lib/utils/`

### Step 2: Create the Utility File

```tsx
// src/lib/utils/myNewUtility.ts

/**
 * Brief description of what this utility does
 * @param paramName - Description of parameter
 * @returns Description of return value
 */
export function myNewUtility(paramName: string): string {
  // Implementation
  return result
}
```

### Step 3: Export from Barrel

```tsx
// src/lib/utils/index.ts
export * from './myNewUtility'
```

### Step 4: Update Documentation

Add to:

- `docs/UTILITY_USAGE.md` (this file)
- `docs/CODING_CONVENTIONS.md` if it's a common pattern
- `AGENTS.md` if it's a key utility

---

## Utility Pattern Examples

### Pattern 1: Simple Transformation

```tsx
// Date formatting, string manipulation
export function transform(value: InputType): OutputType {
  return transformedValue
}
```

### Pattern 2: Data Aggregation

```tsx
// Collecting and grouping data
export function aggregate(items: Item[]): AggregatedResult {
  const grouped = items.reduce((acc, item) => {
    // group logic
    return acc
  }, {})
  return grouped
}
```

### Pattern 3: Filter/Validation

```tsx
// Filtering based on criteria
export function filterByCriteria(items: Item[], criteria: Criteria): Item[] {
  return items.filter((item) => matches(item, criteria))
}
```

### Pattern 4: Computation

```tsx
// Complex calculations
export function calculateMetrics(data: Data[]): Metrics {
  // Compute various metrics
  return { metric1, metric2, metric3 }
}
```

---

## When NOT to Create a Utility

- **Single use** - If it's used in only one place, keep it inline
- **Too specific** - If it's only relevant to one component, keep it there
- **Over-abstraction** - If it makes code harder to read, don't extract it

---

## Utility Testing

While we don't have unit tests currently, utilities are good candidates for future testing:

```tsx
// Example test case structure
describe('getRelativeDate', () => {
  it('returns "Hoje" for today', () => {
    const today = new Date().toISOString()
    expect(getRelativeDate(today)).toBe('Hoje')
  })

  it('returns "Ontem" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    expect(getRelativeDate(yesterday)).toBe('Ontem')
  })
})
```

---

## Import Paths

Always use the `@/` path alias:

```tsx
// ✅ Correct
import { resolveUser } from '@/lib/utils/userUtils'
import { getRelativeDate } from '@/lib/utils/dateUtils'

// ❌ Avoid
import { resolveUser } from '../../../lib/utils/userUtils'
```

---

## Related Documentation

- **CODING_CONVENTIONS.md** - Overall project patterns
- **COMPONENT_STRUCTURE.md** - Component creation guide
- **PAGE_TEMPLATE.md** - Standard page pattern
- **AGENTS.md** - Agent guidelines

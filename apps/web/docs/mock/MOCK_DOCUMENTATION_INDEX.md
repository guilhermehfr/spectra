# Spectra Web App Frontend - Mock Implementation Documentation Index

This documentation provides a comprehensive guide to the authentication mocking and data management system in the Spectra web app frontend.

## Documentation Files

### 1. **MOCK_IMPLEMENTATION_ANALYSIS.md** (26 KB)

Complete technical deep-dive into the entire mock system.

**Covers:**

- Authentication mocking setup (auth-mock.ts, authService.ts, authResolver.ts)
- Mock data structure and centralized state (state.ts)
- MSW handlers and request interception
- API call patterns (lazy-load dispatchers)
- Family dashboard data flow
- Mock data coverage and current scale
- Architecture decisions and patterns
- Environment variables
- Current gaps and expansion points
- File reference guide

**Best for:** Understanding the full architecture, deep-dive debugging, design decisions

**Sections:** 12 major sections with detailed code examples

---

### 2. **MOCK_QUICK_REFERENCE.md** (10 KB)

Quick lookup guide for common tasks and patterns.

**Covers:**

- Environment variables for quick setup
- Authentication flow overview
- Test user credentials
- Mock data relationships
- Current mock data counts
- How API calls work (3-layer pattern)
- Mock state functions API
- Family dashboard data flow (step-by-step)
- Adding new mock data patterns
- API endpoints quick reference
- Key files to understand
- Debugging tips
- Common issues and solutions

**Best for:** Quick lookups, getting started, debugging, troubleshooting

**Sections:** 15 quick-reference sections with tables and code snippets

---

### 3. **MOCK_ARCHITECTURE_DIAGRAMS.md** (44 KB)

Visual ASCII diagrams of the entire mock system.

**Covers 11 detailed diagrams:**

1. Environment-based routing (mock vs real)
2. Mock state - centralized in-memory database
3. Authentication flow (login → dashboard)
4. Family dashboard data resolution (6-step flow)
5. MSW request interception in browser
6. Data flow: Adding new patient
7. MSW handler pattern for CRUD operations
8. Type safety flow
9. Soft delete implementation
10. Denormalization example (session creation)
11. Evolution creation validation chain

**Best for:** Visual learners, understanding data flow, system design review

**Sections:** 11 ASCII diagrams with detailed annotations

---

## Quick Navigation Guide

### I'm trying to...

**Understand the overall architecture**

- Start with: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #1-2
- Then read: MOCK_IMPLEMENTATION_ANALYSIS.md → Sections 1-7

**Get the app running in mock mode**

- Use: MOCK_QUICK_REFERENCE.md → Environment Variables + Test Users
- Reference: MOCK_QUICK_REFERENCE.md → Common Issues

**Debug authentication issues**

- Check: MOCK_QUICK_REFERENCE.md → Debugging Tips
- Reference: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #3
- Deep dive: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 1

**Add new mock data for testing**

- Instructions: MOCK_QUICK_REFERENCE.md → Adding New Mock Data
- Example flow: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #6
- Implementation: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 12

**Understand how API calls work**

- Overview: MOCK_QUICK_REFERENCE.md → How API Calls Work
- Details: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 4
- Visual: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #1

**Modify mock data relationships**

- Pattern: MOCK_QUICK_REFERENCE.md → Mock Data Relationships
- Flow: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #10
- Reference: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 2

**Test the family portal**

- Setup: MOCK_QUICK_REFERENCE.md → Test Users
- Flow: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #4
- Dashboard impl: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 5

**Implement new API endpoints**

- Pattern: MOCK_QUICK_REFERENCE.md → API Endpoints & Handlers
- Handler structure: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #7
- Full guide: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 3

**Switch between mock and real API**

- Instructions: MOCK_QUICK_REFERENCE.md → Environment Variables
- Architecture: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #1
- Details: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 8

**Understand type safety**

- Flow: MOCK_ARCHITECTURE_DIAGRAMS.md → Diagram #8
- Types: MOCK_IMPLEMENTATION_ANALYSIS.md → Section 2.1
- Reference: MOCK_QUICK_REFERENCE.md → Key Files

---

## Key Concepts Summary

### Three-Layer API Pattern

```
┌─────────────────────────────────────────┐
│ 1. Dispatcher Layer                     │
│ (src/lib/api/clinic.ts)                 │
│ Checks DISABLE_MSW, loads impl          │
└─────────────────────────────────────────┘
           ↓
    ┌──────┴──────┐
    ↓             ↓
┌──────────┐  ┌──────────┐
│ 2. Mock  │  │ 2. Real  │
│ Impl     │  │ Impl     │
│ -mock.ts │  │ -real.ts │
└────┬─────┘  └────┬─────┘
     │             │
     ├─ Calls      └─ HTTP
     │  state.*()     calls
     ↓
┌─────────────────────────────────────────┐
│ 3. State/HTTP Layer                     │
│ (state.ts or http.ts)                   │
└─────────────────────────────────────────┘
```

### Mock vs Real Mode

| Aspect           | Mock Mode (Default)           | Real Mode                    |
| ---------------- | ----------------------------- | ---------------------------- |
| **Env Variable** | NEXT_PUBLIC_DISABLE_MSW=false | NEXT_PUBLIC_DISABLE_MSW=true |
| **HTTP Calls**   | None (MSW intercepts)         | Direct HTTP to backend       |
| **Data Storage** | In-memory state.ts            | Backend database             |
| **Auth Cookie**  | Contains user ID              | Contains JWT token           |
| **Startup**      | MSW initializes               | MSW disabled                 |
| **Use Case**     | Development/testing           | Production/testing backend   |

### Mock State Architecture

```
src/mocks/state.ts
├── Auth: currentUser, setCurrentUser(), etc.
├── Patients: patients[], CRUD operations
├── Sessions: sessions[], denormalized fields
├── Evolutions: evolutions[], validation
└── Dashboard: metrics aggregation
```

### Data Relationships

```
Family User (maria@gmail.com)
    ↓
Patient (guardian_email=maria@gmail.com)
    ↓
Session (patient=1, status=completed)
    ↓
Evolution (session=1, released_to_family=true)
```

---

## Current Implementation Status

### Fully Implemented

- ✅ Authentication (login, logout, user resolution)
- ✅ Patients CRUD (full UI and API)
- ✅ Sessions CRUD (full UI and API)
- ✅ Evolutions CRUD (full UI and API)
- ✅ Family portal dashboard
- ✅ Family evolution filtering (list and detail views)
- ✅ Clinic dashboard UI
- ✅ Patient CRUD UI in clinic portal (create, edit, detail, list)
- ✅ Session scheduling UI (create, edit, detail, list)
- ✅ Evolution creation form (standalone and from session detail)
- ✅ Soft deletes
- ✅ Denormalization (auto-populate names)
- ✅ Validation (session status checks)
- ✅ MSW interception

### Partially Implemented

- ⚠️ Dashboard metrics (basic counts, no detailed breakdown)
- ⚠️ Advanced filtering/search
- ⚠️ Pagination

---

## Test Data Available

### Users (4 total)

| Email              | Role      | Password | Notes                                   |
| ------------------ | --------- | -------- | --------------------------------------- |
| admin@spectra.com  | admin     | any      | Clinic access                           |
| ana@spectra.com    | therapist | any      | Clinic access                           |
| carlos@spectra.com | therapist | any      | Clinic access                           |
| maria@gmail.com    | family    | any      | Family portal, Leonard Silva's guardian |

### Patients (14 total)

- Leonard Silva (id=1) - Guardian: Maria Silva (maria@gmail.com)
- Sophia Rodrigues (id=2) - Guardian: João Rodrigues
- Peter Alves (id=3) - Guardian: Fernanda Alves
- Claire Mendes (id=4) - Guardian: Roberto Mendes
- Patients 5-14: Additional test patients with various guardians

### Sessions (13 total)

- Session 1: Leonard Silva + Ana Lima, 2026-04-29, **completed**
- Session 2: Sophia Rodrigues + Ana Lima, 2026-04-29, scheduled
- Session 3: Peter Alves + Carlos Souza, 2026-04-29, scheduled
- Session 4: Claire Mendes + Carlos Souza, 2026-04-29, cancelled
- Session 5: Leonard Silva + Ana Lima, 2026-04-30, scheduled
- Sessions 6-13: Additional sessions covering various patients and statuses

### Evolutions (7 total)

- Evolution 1: Links to Session 1, released to family, Ana Lima's notes
- Evolutions 2-7: Additional evolutions across multiple sessions (4 released to family, 3 not released)

---

## File Organization

### Authentication Files

- `src/lib/authService.ts` - Mock/real selector
- `src/lib/auth.ts` - Real HTTP implementation
- `src/lib/auth-mock.ts` - Mock implementation
- `src/lib/authResolver.ts` - Cookie parsing

### Mock Core

- `src/mocks/state.ts` - In-memory database (251 lines)
- `src/mocks/handlers.ts` - MSW handlers (255 lines)
- `src/mocks/browser.ts` - MSW browser setup (4 lines)
- `instrumentation-client.ts` - MSW initialization hook

### Mock Data

- `src/mocks/data/users.ts` - Test users
- `src/mocks/data/patients.ts` - Test patients
- `src/mocks/data/sessions.ts` - Test sessions
- `src/mocks/data/evolutions.ts` - Test evolutions

### API Layer (Dispatchers)

- `src/lib/api/clinic.ts` - Clinic dispatcher
- `src/lib/api/clinic-mock.ts` - Clinic mock implementation
- `src/lib/api/clinic-real.ts` - Clinic real implementation
- `src/lib/api/family.ts` - Family dispatcher
- `src/lib/api/family-mock.ts` - Family mock implementation
- `src/lib/api/family-real.ts` - Family real implementation
- `src/lib/api/http.ts` - Generic HTTP client

### Types & Pages

- `src/lib/types.ts` - Shared TypeScript types (includes `Messages` type)
- `src/lib/utils/permissionUtils.ts` - Permission checks for sessions/evolutions
- `src/lib/utils/sessionStatusUtils.ts` - Session status display utilities
- `src/lib/utils/translationUtils.ts` - getServerT() for server action translations
- `src/lib/utils/envUtils.ts` - getUseMock() for environment mode checks
- `src/app/actions/auth.ts` - Server actions for login/logout
- `src/app/actions/patient.ts` - Patient CRUD server actions
- `src/app/actions/session.ts` - Session CRUD server actions
- `src/app/actions/evolution.ts` - Evolution CRUD server actions
- `src/app/family/dashboard/page.tsx` - Family dashboard
- `src/app/family/evolutions/page.tsx` - Family evolutions list
- `src/app/clinic/dashboard/page.tsx` - Clinic dashboard
- `src/app/clinic/patients/page.tsx` - Patients list

---

## Common Development Tasks

### 1. Run App in Mock Mode

```bash
export NEXT_PUBLIC_DISABLE_MSW=false
export NODE_ENV=development
pnpm dev
```

### 2. Switch to Real API

```bash
export NEXT_PUBLIC_DISABLE_MSW=true
export NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
pnpm dev
```

### 3. Add More Mock Data

See: MOCK_QUICK_REFERENCE.md → "Adding New Mock Data"

Steps:

1. Edit `src/mocks/data/sessions.ts` - add session
2. Edit `src/mocks/data/evolutions.ts` - add evolution
3. IDs auto-increment, no other changes needed

### 4. Debug MSW Issues

See: MOCK_QUICK_REFERENCE.md → "Debugging Tips"

Check:

- DevTools Network tab for API requests
- Console for environment variables
- Browser for MSW active icon

### 5. Test Authentication

See: MOCK_QUICK_REFERENCE.md → "Test Users"

1. Login with any test user email
2. Any password works in mock mode
3. Check `access_token` cookie contains user ID

---

## Performance Characteristics

| Operation         | Mode | Performance                  |
| ----------------- | ---- | ---------------------------- |
| Get patients      | Mock | Instant (~1ms)               |
| Get patients      | Real | Network dependent (50-200ms) |
| Create patient    | Mock | Instant (~1ms)               |
| Create patient    | Real | Network dependent (50-200ms) |
| Family evolutions | Mock | Instant (~1ms)               |
| Family evolutions | Real | Network dependent (50-200ms) |

Mock mode has negligible latency, making it excellent for rapid development and testing.

---

## Troubleshooting Matrix

| Symptom                      | Root Cause                    | Solution                 |
| ---------------------------- | ----------------------------- | ------------------------ |
| API calls fail               | DISABLE_MSW=true + no backend | Set DISABLE_MSW=false    |
| MSW not working              | NODE_ENV != development       | Set NODE_ENV=development |
| Family can't see evolutions  | released_to_family=false      | Edit evolutions.ts       |
| Session can't have evolution | status != completed           | Change session status    |
| Patient not found            | guardian_email mismatch       | Update patient data      |
| Login fails                  | User not in mockUsers         | Add test user            |

---

## Next Steps for Contributors

1. **Expand mock data** - Add more evolutions for pagination/history testing
2. **Add more test users** - Different scenarios and edge cases
3. **Add search/filter** - Mock implementation of query params
4. **Implement pagination** - Extend mock handlers with limit/offset
5. **Add real API integration tests** - Verify mock/real parity
6. **Improve dashboard metrics** - More detailed breakdown in mock data

---

## Related Documentation

- **AGENTS.md** - Project guidelines and conventions
- **MOCK_IMPLEMENTATION_ANALYSIS.md** - Full technical analysis
- **MOCK_QUICK_REFERENCE.md** - Quick lookup guide
- **MOCK_ARCHITECTURE_DIAGRAMS.md** - Visual diagrams

---

## Document Metadata

| Property         | Value             |
| ---------------- | ----------------- |
| Created          | May 4, 2026       |
| Last Updated     | June 10, 2026     |
| Coverage         | Complete          |
| Files Documented | 30+ core files    |
| Code Examples    | 50+               |
| Diagrams         | 11 ASCII diagrams |
| Test Data        | 24 total records  |

---

## Questions & Support

For questions about specific aspects:

1. **Authentication**: See MOCK_IMPLEMENTATION_ANALYSIS.md Section 1
2. **Data Structure**: See MOCK_IMPLEMENTATION_ANALYSIS.md Section 2
3. **API Flow**: See MOCK_IMPLEMENTATION_ANALYSIS.md Section 4
4. **Dashboard**: See MOCK_IMPLEMENTATION_ANALYSIS.md Section 5
5. **Adding Data**: See MOCK_QUICK_REFERENCE.md "Adding New Mock Data"
6. **Visual Reference**: See MOCK_ARCHITECTURE_DIAGRAMS.md

---

**Total Documentation**: 80 KB across 3 detailed documents + this index

# Spectra Web App - Component Structure Guide

This guide covers how to create, organize, and structure components in the Spectra application.

---

## Directory Structure

```
src/components/
├── auth/                     # Authentication
│   ├── index.ts               # Barrel export
│   ├── BaseLoginForm.tsx     # Shared login form base
│   ├── LoginForm.tsx         # Main login form component
│   └── FamilyLoginForm.tsx   # Family login portal
├── layout/
│   ├── clinic/
│   │   ├── Layout.tsx         # Main clinic layout wrapper
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   ├── SearchBar.tsx      # Patient search
│   │   ├── Sidebar.tsx        # Sidebar container
│   │   ├── SidebarHeader.tsx  # Sidebar header
│   │   ├── SidebarNav.tsx     # Sidebar navigation
│   │   ├── SidebarFooter.tsx # Sidebar footer
│   │   ├── UserAvatar.tsx     # User avatar display
│   │   ├── index.ts           # Barrel export
│   │   └── types.ts           # Layout-specific types
│   └── family/
│       ├── Header.tsx         # Family portal header
│       ├── Navbar.tsx         # Family navigation
│       ├── index.ts            # Barrel export
│       └── types.ts           # Layout-specific types
└── ui/
    ├── clinic/              # Clinic-specific UI components
    │   ├── DashboardContent.tsx
    │   ├── DashboardStats.tsx
    │   ├── WeeklyChart.tsx
    │   ├── PatientsContent.tsx
    │   ├── PatientsTable.tsx
    │   ├── PatientsPageHeader.tsx
    │   ├── PatientDetailContent.tsx
    │   ├── PatientDetailHeader.tsx
    │   ├── PatientInfoCard.tsx
    │   ├── PatientSessionsSection.tsx
    │   ├── PatientEvolutionsSection.tsx
    │   ├── PatientForm.tsx
    │   ├── PaginationNav.tsx
    │   └── index.ts           # Barrel export
    ├── family/              # Family-specific UI components
    │   ├── DashboardStats.tsx
    │   └── LatestEvolutionCard.tsx
    └── shared/              # Reusable UI components
        ├── index.ts            # Barrel export
        ├── Avatar.tsx
        ├── Button.tsx
        ├── Input.tsx
        ├── InputField.tsx      # Form input with label
        ├── SelectField.tsx    # Form select dropdown
        ├── TextareaField.tsx  # Form textarea
        ├── BaseForm.tsx       # Base form wrapper
        ├── Container.tsx
        └── IconButton.tsx
```

---

## Component Types

### 1. Shared UI Components (`ui/shared/`)

Reusable components that can be used anywhere in the application.

**Characteristics:**

- No portal-specific logic
- Accept props via TypeScript interfaces
- Use tailwind-merge for class composition

**Example - Button.tsx:**

```tsx
import { twMerge } from 'tailwind-merge'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={twMerge('base-styles', variantStyles[variant], className)} {...props} />
}
```

### 2. Domain UI Components (`ui/clinic/` or `ui/family/`)

Components specific to a portal that encapsulate domain logic.

**Characteristics:**

- Know about domain types (Patient, Session, Evolution)
- Handle portal-specific display logic
- May use shared UI components internally

### 3. Layout Components (`layout/clinic/` or `layout/family/`)

Wrappers that provide consistent layout structure for pages.

**Characteristics:**

- Accept user prop for auth context
- Provide navigation, headers, sidebars
- Handle responsive behavior
- Include portal-specific branding

### 4. Auth Components (`auth/`)

Authentication-related components.

**Characteristics:**

- Use 'use client' directive (interactive)
- Use Server Actions for form submission
- Handle validation and error display

---

## Creating a New Shared Component

### Step 1: Create the Component File

```tsx
// src/components/ui/shared/MyComponent.tsx
import { twMerge } from 'tailwind-merge'
import type { ReactNode } from 'react'

interface MyComponentProps {
  children?: ReactNode
  className?: string
  variant?: 'default' | 'compact'
}

export function MyComponent({ children, className, variant = 'default' }: MyComponentProps) {
  return (
    <div className={twMerge('base-classes', variantClasses[variant], className)}>{children}</div>
  )
}

const variantClasses = {
  default: 'p-4',
  compact: 'p-2',
}
```

### Step 2: Export from Index

```tsx
// src/components/ui/shared/index.ts
export * from './Avatar'
export * from './Button'
export * from './Container'
export * from './IconButton'
export * from './Input'
export * from './MyComponent' // Add this line
```

### Step 3: Use in Pages/Components

```tsx
import { MyComponent } from '@/components/ui/shared'

export function MyFeature() {
  return <MyComponent variant="compact">Content</MyComponent>
}
```

---

## Creating a New Domain Component

### Step 1: Choose the Right Location

- Clinic-specific: `src/components/ui/clinic/`
- Family-specific: `src/components/ui/family/`

### Step 2: Import Domain Types

```tsx
// src/components/ui/clinic/ClinicPatientCard.tsx
import type { Patient } from '@/lib/types'
import { Avatar } from '@/components/ui/shared/Avatar'

interface ClinicPatientCardProps {
  patient: Patient
  onSelect?: (patient: Patient) => void
}

export function ClinicPatientCard({ patient, onSelect }: ClinicPatientCardProps) {
  return (
    <div className="card-styles">
      <Avatar name={patient.name} />
      <div>{patient.name}</div>
    </div>
  )
}
```

### Step 3: Export from Domain Index

```tsx
// src/components/ui/clinic/index.ts
export * from './ClinicDashboardContent'
// ... other exports
export * from './ClinicPatientCard' // Add this line
```

---

## Creating a New Login Portal

### Step 1: Extend BaseLoginForm

```tsx
// src/components/auth/NewPortalLoginForm.tsx
'use client'

import { BaseLoginForm } from './BaseLoginForm'
import { IconType } from 'lucide-react'

interface Props {
  Icon: IconType
  subtitle: string
}

export function NewPortalLoginForm({ Icon, subtitle }: Props) {
  return (
    <BaseLoginForm
      subtitle={subtitle}
      startIcon={<Icon size={25} className="text-blue-600" strokeWidth={2} />}
    />
  )
}
```

### Step 2: Create the Page

```tsx
// src/app/login/new-portal/page.tsx
import { NewPortalLoginForm } from '@/components/auth/NewPortalLoginForm'
import { CustomIcon } from 'lucide-react'

export default function NewPortalLoginPage() {
  return <NewPortalLoginForm Icon={CustomIcon} subtitle="New Portal Description" />
}
```

---

## Component Props Best Practices

### 1. Use Explicit Interfaces

```tsx
// ✅ Good - explicit interface
interface PatientCardProps {
  patient: Patient
  isSelected?: boolean
  onSelect?: (patient: Patient) => void
}

// ❌ Avoid - vague types
interface Props {
  data: any
}
```

### 2. Provide Default Values

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' // Optional with default
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md' }: ButtonProps) {
  // Has defaults, always has values
}
```

### 3. Use Children Prop for Content

```tsx
interface CardProps {
  title?: string
  children: ReactNode // For content
  footer?: ReactNode // Optional additional content
}
```

---

## Client vs Server Components

### Server Components (Default)

```tsx
// src/components/ui/clinic/ClinicDashboardContent.tsx
// No 'use client' - this is a Server Component

import type { Patient } from '@/lib/types'

interface Props {
  patients: Patient[]
}

export function ClinicDashboardContent({ patients }: Props) {
  // Render logic - runs on server
  return (
    <div>
      {patients.map((p) => (
        <PatientRow key={p.id} patient={p} />
      ))}
    </div>
  )
}
```

### Client Components (When Needed)

Add `'use client'` when:

- Using React hooks (useState, useEffect, useRef)
- Handling browser events (onClick, onChange)
- Using client-only libraries

```tsx
// src/components/ui/shared/Input.tsx
'use client'

import { useState } from 'react'

export function Input() {
  const [value, setValue] = useState('') // React hooks require client
  // ...
}
```

---

## Component Testing Guidelines

### Visual Regression Testing

- Test at common breakpoints: mobile (375px), tablet (768px), desktop (1440px)
- Verify responsive variants
- Check error/loading/empty states

### Props Validation

- Test with all required props
- Test optional props with and without values
- Test edge cases (empty arrays, null values)

---

## Related Documentation

- **CODING_CONVENTIONS.md** - Project patterns and best practices
- **UTILITY_USAGE.md** - When and how to create utilities
- **PAGE_TEMPLATE.md** - Standard page pattern
- **AGENTS.md** - Agent guidelines and project state

import { NextIntlClientProvider } from 'next-intl'
import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'

const messages = {
  Common: {
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    paginationShowing: 'Showing {startItem}-{endItem} of {totalItems}',
  },
  Patients: {
    tableHeaderPatient: 'Patient',
    tableHeaderGuardian: 'Guardian',
    tableHeaderBirthDate: 'Birth Date',
    tableHeaderActions: 'Actions',
    noPatientsFound: 'No patients found',
    deleteRestricted: 'Cannot delete',
    editTitle: 'Edit Patient',
    newPatient: 'New Patient',
    editDescription: 'Edit patient details',
    newDescription: 'Fill in patient details',
    register: 'Register',
    formName: 'Full name',
    formNamePlaceholder: 'Enter full name',
    formBirthDate: 'Birth date',
    formGuardian: 'Guardian name',
    formGuardianPlaceholder: 'Enter guardian name',
    formGuardianEmail: 'Guardian email',
    formGuardianEmailPlaceholder: 'Enter guardian email',
    formNotes: 'Notes',
    formNotesPlaceholder: 'Enter notes',
  },
  Dashboard: {
    activePatients: 'Active Patients',
    todaySessions: "Today's Sessions",
    pendingEvolutions: 'Pending Evolutions',
  },
  Login: {
    email: 'Email',
    password: 'Password',
    submit: 'Sign In',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    contactAdmin: 'Contact admin',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render }

import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import type { Patient } from '@/lib/types'

const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh, back: vi.fn() }),
}))

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), dismiss: vi.fn() },
}))

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useActionState: vi.fn((_action, initialState) => [initialState, vi.fn(), false]),
  }
})

import { PatientForm } from './PatientForm'

const mockFormAction = vi.fn()

const mockPatient: Patient = {
  id: 1,
  name: 'Ana Silva',
  birth_date: '2018-05-12',
  guardian_name: 'Maria Silva',
  guardian_email: 'maria@email.com',
  notes: 'Some notes',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('PatientForm', () => {
  it('renders create mode title', () => {
    render(<PatientForm formAction={mockFormAction} cancelHref="/clinic/patients" />)

    expect(screen.getByText('New Patient')).toBeInTheDocument()
    expect(screen.getByText('Fill in patient details')).toBeInTheDocument()
  })

  it('renders edit mode title', () => {
    render(
      <PatientForm
        patient={mockPatient}
        formAction={mockFormAction}
        cancelHref="/clinic/patients"
      />
    )

    expect(screen.getByText('Edit Patient')).toBeInTheDocument()
    expect(screen.getByText('Edit patient details')).toBeInTheDocument()
  })

  it('renders register button in create mode', () => {
    render(<PatientForm formAction={mockFormAction} cancelHref="/clinic/patients" />)

    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('renders save button in edit mode', () => {
    render(
      <PatientForm
        patient={mockPatient}
        formAction={mockFormAction}
        cancelHref="/clinic/patients"
      />
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('pre-fills fields with patient data in edit mode', () => {
    render(
      <PatientForm
        patient={mockPatient}
        formAction={mockFormAction}
        cancelHref="/clinic/patients"
      />
    )

    const nameInput = screen.getByLabelText('Full name') as HTMLInputElement
    expect(nameInput.value).toBe('Ana Silva')

    const guardianInput = screen.getByLabelText('Guardian name') as HTMLInputElement
    expect(guardianInput.value).toBe('Maria Silva')
  })

  it('renders hidden id input in edit mode', () => {
    render(
      <PatientForm
        patient={mockPatient}
        formAction={mockFormAction}
        cancelHref="/clinic/patients"
      />
    )

    const hiddenInput = document.querySelector('input[name="id"]') as HTMLInputElement
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput.value).toBe('1')
  })

  it('does not render hidden id input in create mode', () => {
    render(<PatientForm formAction={mockFormAction} cancelHref="/clinic/patients" />)

    expect(document.querySelector('input[name="id"]')).not.toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<PatientForm formAction={mockFormAction} cancelHref="/clinic/patients" />)

    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
    expect(screen.getByLabelText('Birth date')).toBeInTheDocument()
    expect(screen.getByLabelText('Guardian name')).toBeInTheDocument()
    expect(screen.getByLabelText('Guardian email')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('renders cancel button with correct href', () => {
    render(<PatientForm formAction={mockFormAction} cancelHref="/clinic/patients" />)

    const cancelLink = screen.getByText('Cancel')
    expect(cancelLink.closest('a')).toHaveAttribute('href', '/clinic/patients')
  })
})

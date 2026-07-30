import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { PatientsTable } from './PatientsTable'
import type { Patient } from '@/lib/types'

const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Ana Silva',
    birth_date: '2018-05-12',
    guardian_name: 'Maria Silva',
    guardian_email: 'maria@email.com',
    notes: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'João Santos',
    birth_date: '2019-08-22',
    guardian_name: 'Pedro Santos',
    guardian_email: 'pedro@email.com',
    notes: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

describe('PatientsTable', () => {
  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <PatientsTable patients={[]} isLoading />
    )

    const skeletonRows = container.querySelectorAll('.animate-pulse')
    expect(skeletonRows.length).toBeGreaterThanOrEqual(4)
  })

  it('renders empty state when no patients', () => {
    render(<PatientsTable patients={[]} />)

    expect(screen.getByText('No patients found')).toBeInTheDocument()
  })

  it('renders patient rows', () => {
    render(<PatientsTable patients={mockPatients} />)

    expect(screen.getByText('Ana Silva')).toBeInTheDocument()
    expect(screen.getByText('João Santos')).toBeInTheDocument()
  })

  it('renders guardian names', () => {
    render(<PatientsTable patients={mockPatients} />)

    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
    expect(screen.getByText('Pedro Santos')).toBeInTheDocument()
  })

  it('calls onView when patient name is clicked', async () => {
    const handleView = vi.fn()
    const user = userEvent.setup()

    render(<PatientsTable patients={mockPatients} onView={handleView} />)

    await user.click(screen.getByText('Ana Silva'))

    expect(handleView).toHaveBeenCalledWith(mockPatients[0])
  })

  it('calls onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn()
    const user = userEvent.setup()

    render(<PatientsTable patients={mockPatients} onEdit={handleEdit} />)

    const editBtn = screen.getAllByRole('button', { name: 'Edit' })[0]
    await user.click(editBtn)

    expect(handleEdit).toHaveBeenCalledWith(mockPatients[0])
  })

  it('calls onDelete when delete button is clicked', async () => {
    const handleDelete = vi.fn()
    const user = userEvent.setup()

    render(<PatientsTable patients={mockPatients} onDelete={handleDelete} />)

    const deleteBtn = screen.getAllByRole('button', { name: 'Delete' })[0]
    await user.click(deleteBtn)

    expect(handleDelete).toHaveBeenCalledWith(mockPatients[0])
  })

  it('disables delete button when canDelete is false', () => {
    render(<PatientsTable patients={mockPatients} canDelete={false} />)

    const deleteBtns = screen.getAllByRole('button', { name: 'Cannot delete' })
    deleteBtns.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })

  it('renders table headers', () => {
    render(<PatientsTable patients={mockPatients} />)

    expect(screen.getByText('Patient')).toBeInTheDocument()
    expect(screen.getByText('Guardian')).toBeInTheDocument()
    expect(screen.getByText('Birth Date')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
})

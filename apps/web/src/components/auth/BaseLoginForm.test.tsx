import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useActionState: vi.fn((_action, initialState) => [initialState, vi.fn(), false]),
  }
})

vi.mock('@/app/actions/auth', () => ({
  loginAction: vi.fn(),
}))

import { BaseLoginForm } from './BaseLoginForm'

describe('BaseLoginForm', () => {
  it('renders the subtitle', () => {
    render(<BaseLoginForm subtitle="Clinic access" />)

    expect(screen.getByText('Clinic access')).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    render(<BaseLoginForm subtitle="Clinic access" />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders the sign in button', () => {
    render(<BaseLoginForm subtitle="Clinic access" />)

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('password input starts hidden', () => {
    render(<BaseLoginForm subtitle="Clinic access" />)

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('toggles password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup()

    render(<BaseLoginForm subtitle="Clinic access" />)

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByLabelText('Show password')
    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByLabelText('Hide password'))

    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('renders forgot password link', () => {
    render(<BaseLoginForm subtitle="Clinic access" />)

    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
  })

  it('renders contact admin link', () => {
    render(<BaseLoginForm subtitle="Clinic access" />)

    expect(screen.getByText('Contact admin')).toBeInTheDocument()
  })
})

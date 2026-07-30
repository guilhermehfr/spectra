import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Full name" placeholder="Enter name" />)

    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
  })

  it('shows hint text', () => {
    render(<Input label="Email" hint="We will not share your email" />)

    expect(screen.getByText('We will not share your email')).toBeInTheDocument()
  })

  it('shows error text', () => {
    render(<Input label="Email" error="Invalid email" />)

    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('shows error text and hides hint when both are provided', () => {
    render(<Input label="Email" hint="We will not share your email" error="Invalid email" />)

    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.queryByText('We will not share your email')).not.toBeInTheDocument()
  })

  it('applies error border class when error is present', () => {
    render(<Input label="Email" error="Invalid email" />)

    const input = screen.getByLabelText('Email')
    expect(input.className).toContain('border-red-400')
  })

  it('controlled mode: displays value prop', async () => {
    const user = userEvent.setup()

    const { rerender } = render(<Input label="Name" value="John" onChange={() => {}} />)

    const input = screen.getByLabelText('Name') as HTMLInputElement
    expect(input.value).toBe('John')

    await user.type(input, 'ny')
    expect(input.value).toBe('John')
  })

  it('uncontrolled mode: typing updates value', async () => {
    const user = userEvent.setup()

    render(<Input label="Name" />)

    const input = screen.getByLabelText('Name') as HTMLInputElement
    await user.type(input, 'John')

    expect(input.value).toBe('John')
  })

  it('disabled input cannot be typed into', async () => {
    const user = userEvent.setup()

    render(<Input label="Name" disabled />)

    const input = screen.getByLabelText('Name') as HTMLInputElement
    await user.type(input, 'John')

    expect(input.value).toBe('')
  })

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input label="Name" onChange={handleChange} />)

    await user.type(screen.getByLabelText('Name'), 'a')

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('generates an id when none is provided and labels for attribute match', () => {
    render(<Input label="Name" />)

    const input = screen.getByLabelText('Name')
    const labels = screen.getAllByText('Name')

    expect(input).toBeInTheDocument()
    expect(labels.length).toBeGreaterThanOrEqual(1)
  })

  it('uses provided id when id prop is given', () => {
    render(<Input label="Name" id="custom-id" />)

    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('id', 'custom-id')
  })

  it('renders startIcon', () => {
    render(<Input label="Search" startIcon={<span data-testid="start-icon">🔍</span>} />)

    expect(screen.getByTestId('start-icon')).toBeInTheDocument()
  })

  it('renders endIcon', () => {
    render(<Input label="Search" endIcon={<span data-testid="end-icon">✕</span>} />)

    expect(screen.getByTestId('end-icon')).toBeInTheDocument()
  })

  it('applies fullWidth class by default', () => {
    render(<Input label="Name" />)

    const wrapper = screen.getByLabelText('Name').closest('div')?.parentElement
    expect(wrapper?.className).toContain('w-full')
  })
})

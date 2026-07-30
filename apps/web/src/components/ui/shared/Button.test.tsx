import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Save</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-[linear-gradient(90deg,#2563EB,#4648D4)]')
  })

  it('applies secondary variant class', () => {
    render(<Button variant="secondary">Cancel</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-white')
    expect(button.className).toContain('border-slate-200')
  })

  it('applies ghost variant class', () => {
    render(<Button variant="ghost">View</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-transparent')
  })

  it('applies sm size class', () => {
    render(<Button size="sm">Edit</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('px-3 py-2 text-sm')
  })

  it('applies lg size class', () => {
    render(<Button size="lg">Create</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('px-6 py-3 text-base')
  })

  it('shows spinner and hides children when loading', () => {
    render(<Button loading>Save</Button>)

    const button = screen.getByRole('button')
    expect(button.querySelector('svg.animate-spin')).toBeInTheDocument()
    expect(button).not.toHaveTextContent('Save')
  })

  it('disables button when loading', () => {
    render(<Button loading>Save</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Save</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Save</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('w-full')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button disabled onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders startIcon', () => {
    render(<Button startIcon={<span data-testid="start-icon">*</span>}>Save</Button>)

    expect(screen.getByTestId('start-icon')).toBeInTheDocument()
  })

  it('renders endIcon', () => {
    render(<Button endIcon={<span data-testid="end-icon">*</span>}>Save</Button>)

    expect(screen.getByTestId('end-icon')).toBeInTheDocument()
  })
})

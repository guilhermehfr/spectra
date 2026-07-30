import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { PaginationNav } from './PaginationNav'

describe('PaginationNav', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
  }

  it('renders pagination info text', () => {
    render(<PaginationNav {...defaultProps} />)

    expect(screen.getByText(/Showing 1-10 of 50/)).toBeInTheDocument()
  })

  it('renders correct number of page buttons', () => {
    render(<PaginationNav {...defaultProps} />)

    const pageButtons = screen.getAllByRole('button').filter((btn) => {
      const text = btn.textContent?.trim() ?? ''
      return text !== '' && !isNaN(Number(text))
    })
    expect(pageButtons).toHaveLength(5)
  })

  it('disables previous button on first page', () => {
    render(<PaginationNav {...defaultProps} currentPage={1} />)

    const prevButton = screen.getAllByRole('button')[0]
    expect(prevButton).toBeDisabled()
  })

  it('enables previous button after first page', () => {
    render(<PaginationNav {...defaultProps} currentPage={3} />)

    const prevButton = screen.getAllByRole('button')[0]
    expect(prevButton).not.toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<PaginationNav {...defaultProps} currentPage={5} />)

    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('hides pagination when totalPages is 1', () => {
    render(<PaginationNav {...defaultProps} totalPages={1} totalItems={5} />)

    const buttons = screen.queryAllByRole('button')
    expect(buttons.length).toBe(0)
  })

  it('calls onPageChange when a page is clicked', async () => {
    const handlePageChange = vi.fn()
    const user = userEvent.setup()

    render(<PaginationNav {...defaultProps} onPageChange={handlePageChange} />)

    await user.click(screen.getByText('3'))

    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it('highlights current page with gradient class', () => {
    render(<PaginationNav {...defaultProps} currentPage={3} />)

    const pageButton = screen.getByText('3')
    expect(pageButton.className).toContain('gradient')
  })
})

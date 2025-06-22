import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '../Search'

// Mock fetch API
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Search Component', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch.mockReset()
    // Setup default mock response
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ results: [] })
    })
  })

  it('renders search input with default value', () => {
    const setFoodData = vi.fn()
    render(<Search foodData={[]} setFoodData={setFoodData} />)
    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput.value).toBe('pizza') // Default value from useState
  })

  it('updates search query and makes API call when user types', async () => {
    const setFoodData = vi.fn()
    const user = userEvent.setup()
    
    render(<Search foodData={[]} setFoodData={setFoodData} />)
    const searchInput = screen.getByRole('textbox')
    
    // Type new search term
    await user.clear(searchInput) // Clear default value first
    await user.type(searchInput, 'pizza')

    // Check if fetch was called with correct URL
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('query=pizza')
    )
  })

  it('updates food data when API returns results', async () => {
    const mockResults = [{ id: 1, title: 'Test Recipe' }]
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: mockResults })
    })

    const setFoodData = vi.fn()
    render(<Search foodData={[]} setFoodData={setFoodData} />)

    // Wait for the initial useEffect call to complete
    await vi.waitFor(() => {
      expect(setFoodData).toHaveBeenCalledWith(mockResults)
    })
  })
})

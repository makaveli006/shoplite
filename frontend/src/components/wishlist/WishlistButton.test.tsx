import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/api/wishlist'
import { makeProduct, makeWishlistItem, signedIn } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'

import { WishlistButton } from './WishlistButton'

// Replace the functions that talk to the API with fakes that each test controls.
vi.mock('@/api/wishlist', () => ({
  fetchWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}))

const SAVE = 'Save Chef Knife to your wishlist'
const REMOVE = 'Remove Chef Knife from your wishlist'

function FakeLoginPage() {
  const location = useLocation()
  return <p>Login page {location.search}</p>
}

describe('WishlistButton', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('sends visitors to the sign-in page and back to where they were', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/products" element={<WishlistButton product={makeProduct()} />} />
        <Route path="/login" element={<FakeLoginPage />} />
      </Routes>,
      { route: '/products?category=kitchen' },
    )

    await userEvent.click(screen.getByRole('button', { name: SAVE }))

    expect(screen.getByText(/Login page/)).toHaveTextContent('?next=%2Fproducts%3Fcategory%3Dkitchen')
    expect(addToWishlist).not.toHaveBeenCalled()
    expect(fetchWishlist).not.toHaveBeenCalled() // visitors have no wishlist to load
  })

  it('saves a product and shows the heart as pressed', async () => {
    // The server's list: empty at first, then containing the knife after saving it.
    vi.mocked(fetchWishlist).mockResolvedValueOnce([]).mockResolvedValue([makeWishlistItem()])
    vi.mocked(addToWishlist).mockResolvedValue(makeWishlistItem())
    renderWithProviders(<WishlistButton product={makeProduct()} />, { auth: signedIn() })
    await waitFor(() => expect(fetchWishlist).toHaveBeenCalled())

    const button = screen.getByRole('button', { name: SAVE })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(button)

    expect(addToWishlist).toHaveBeenCalledWith(7)
    expect(await screen.findByRole('button', { name: REMOVE })).toHaveAttribute('aria-pressed', 'true')
  })

  it('removes a product that is already saved', async () => {
    vi.mocked(fetchWishlist).mockResolvedValueOnce([makeWishlistItem()]).mockResolvedValue([])
    vi.mocked(removeFromWishlist).mockResolvedValue()
    renderWithProviders(<WishlistButton product={makeProduct()} />, { auth: signedIn() })

    const button = await screen.findByRole('button', { name: REMOVE })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(button)

    expect(removeFromWishlist).toHaveBeenCalledWith(7)
    expect(await screen.findByRole('button', { name: SAVE })).toHaveAttribute('aria-pressed', 'false')
  })

  it('puts the heart back when saving fails', async () => {
    vi.mocked(fetchWishlist).mockResolvedValue([])
    vi.mocked(addToWishlist).mockRejectedValue(new Error('network down'))
    renderWithProviders(<WishlistButton product={makeProduct()} />, { auth: signedIn() })
    await waitFor(() => expect(fetchWishlist).toHaveBeenCalled())

    await userEvent.click(screen.getByRole('button', { name: SAVE }))

    expect(addToWishlist).toHaveBeenCalledWith(7)
    // Finished (enabled again) and not saved: the early "saved" look was undone.
    await waitFor(() => expect(screen.getByRole('button', { name: SAVE })).toBeEnabled())
    expect(screen.getByRole('button', { name: SAVE })).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows a text button on the product page', async () => {
    vi.mocked(fetchWishlist).mockResolvedValue([makeWishlistItem()])
    renderWithProviders(<WishlistButton product={makeProduct()} variant="full" />, { auth: signedIn() })

    expect(await screen.findByRole('button', { name: 'Saved' })).toHaveAttribute('aria-pressed', 'true')
  })
})

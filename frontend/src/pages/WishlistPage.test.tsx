import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { addToCart } from '@/api/cart'
import { fetchWishlist, removeFromWishlist } from '@/api/wishlist'
import { makeWishlistItem, signedIn } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'
import type { Cart } from '@/types/api'

import { WishlistPage } from './WishlistPage'

vi.mock('@/api/wishlist', () => ({
  fetchWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}))
vi.mock('@/api/cart', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/cart')>()),
  fetchCart: vi.fn(),
  addToCart: vi.fn(),
}))

const knife = makeWishlistItem()
const kettle = makeWishlistItem({ id: 2, product: { id: 8, name: 'Old Kettle', slug: 'old-kettle', price: '30.00', is_active: false } })
const mug = makeWishlistItem({ id: 3, product: { id: 9, name: 'Blue Mug', slug: 'blue-mug', price: '12.50', stock: 0, in_stock: false } })

function showPage() {
  renderWithProviders(<WishlistPage />, { route: '/wishlist', auth: signedIn() })
}

describe('WishlistPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(addToCart).mockResolvedValue({ items: [], item_count: 1 } as unknown as Cart)
  })

  it('invites to browse when nothing is saved', async () => {
    vi.mocked(fetchWishlist).mockResolvedValue([])
    showPage()

    expect(await screen.findByText('Your wishlist is empty')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute('href', '/products')
  })

  it('lists saved products and only lets you buy the available ones', async () => {
    vi.mocked(fetchWishlist).mockResolvedValue([knife, kettle, mug])
    showPage()

    expect(await screen.findByText('3 saved products')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Chef Knife' })).toHaveAttribute('href', '/products/chef-knife')
    expect(screen.getByText(/49\.99/)).toBeInTheDocument()
    expect(screen.getByText('No longer available')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Old Kettle' })).not.toBeInTheDocument() // hidden product: no page
    expect(screen.getByText('Out of stock')).toBeInTheDocument()

    const [knifeButton, kettleButton, mugButton] = screen.getAllByRole('button', { name: /Add to cart/ })
    expect(knifeButton).toBeEnabled()
    expect(kettleButton).toBeDisabled()
    expect(mugButton).toBeDisabled()
  })

  it('adds one piece to the cart and keeps the product saved', async () => {
    vi.mocked(fetchWishlist).mockResolvedValue([knife])
    showPage()

    await userEvent.click(await screen.findByRole('button', { name: /Add to cart/ }))

    expect(addToCart).toHaveBeenCalledWith(7, 1)
    expect(screen.getByRole('link', { name: 'Chef Knife' })).toBeInTheDocument()
    expect(removeFromWishlist).not.toHaveBeenCalled()
  })

  it('removes a product from the wishlist', async () => {
    vi.mocked(fetchWishlist).mockResolvedValueOnce([knife]).mockResolvedValue([])
    vi.mocked(removeFromWishlist).mockResolvedValue()
    showPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Remove Chef Knife from your wishlist' }))

    expect(removeFromWishlist).toHaveBeenCalledWith(7)
    expect(await screen.findByText('Your wishlist is empty')).toBeInTheDocument()
  })
})

import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchCategories, fetchProducts } from '@/api/catalog'
import { categories, makeProduct, page } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'

import { ProductsPage } from './ProductsPage'

// Replace the real API calls with stand-ins, so these tests never need Django.
vi.mock('@/api/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/catalog')>()),
  fetchProducts: vi.fn(),
  fetchCategories: vi.fn(),
}))

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.mocked(fetchProducts).mockReset()
    vi.mocked(fetchCategories).mockResolvedValue(categories)
  })

  it('shows the products from the API', async () => {
    vi.mocked(fetchProducts).mockResolvedValue(
      page([makeProduct(), makeProduct({ id: 8, name: 'Blue Mug', slug: 'blue-mug', price: '12.50' })]),
    )
    renderWithProviders(<ProductsPage />, { route: '/products' })

    // "findBy..." waits until the (stand-in) request has answered and the page has updated.
    expect(await screen.findByText('Chef Knife')).toBeInTheDocument()
    expect(screen.getByText('Blue Mug')).toBeInTheDocument()
    expect(screen.getByText('2 products')).toBeInTheDocument()
  })

  it('sends the filters from the web address to the API', async () => {
    vi.mocked(fetchProducts).mockResolvedValue(page([makeProduct()]))
    renderWithProviders(<ProductsPage />, { route: '/products?category=kitchen&ordering=price&page=2' })

    await screen.findByText('Chef Knife')
    expect(fetchProducts).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'kitchen', ordering: 'price', page: 2 }),
    )
  })

  it('says so when nothing matches', async () => {
    vi.mocked(fetchProducts).mockResolvedValue(page([]))
    renderWithProviders(<ProductsPage />, { route: '/products?search=zzz' })

    expect(await screen.findByText('No products match your filters.')).toBeInTheDocument()
  })

  it('offers "Try again" when loading fails', async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error('network down'))
    renderWithProviders(<ProductsPage />, { route: '/products' })

    expect(await screen.findByText("Couldn't load the products.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})

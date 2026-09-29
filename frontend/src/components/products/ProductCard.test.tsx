import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'

import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  it('shows the name, category and price, and links to the product page', () => {
    renderWithProviders(<ProductCard product={makeProduct()} />)

    expect(screen.getByText('Chef Knife')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText(/49\.99/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/chef-knife')
  })

  it('marks products that are out of stock', () => {
    renderWithProviders(<ProductCard product={makeProduct({ stock: 0, in_stock: false })} />)
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  it('does not mark products that are in stock', () => {
    renderWithProviders(<ProductCard product={makeProduct()} />)
    expect(screen.queryByText('Out of stock')).not.toBeInTheDocument()
  })
})

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

  it('shows the average rating and number of reviews', () => {
    renderWithProviders(<ProductCard product={makeProduct({ average_rating: 4.5, review_count: 3 })} />)
    expect(screen.getByRole('img', { name: 'Rated 4.5 out of 5' })).toBeInTheDocument()
    expect(screen.getByText('4.5 (3)')).toBeInTheDocument()
  })

  it('has a wishlist heart next to the link, not inside it', () => {
    renderWithProviders(<ProductCard product={makeProduct()} />)
    const heart = screen.getByRole('button', { name: 'Save Chef Knife to your wishlist' })
    expect(screen.getByRole('link')).not.toContainElement(heart) // a button inside a link is invalid HTML
  })

  it('shows the matching part of the description while searching', () => {
    const { container } = renderWithProviders(
      <ProductCard product={makeProduct({ search_snippet: 'A 20 cm stainless steel chef \u0002knife\u0003.' })} />,
    )
    expect(container.querySelector('mark')).toHaveTextContent('knife')
  })

  it('shows no stars for a product without reviews', () => {
    renderWithProviders(<ProductCard product={makeProduct()} />)
    expect(screen.queryByRole('img', { name: /Rated/ })).not.toBeInTheDocument()
  })
})

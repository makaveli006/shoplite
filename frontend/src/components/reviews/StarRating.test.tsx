import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StarRating } from './StarRating'

function filledStars(container: HTMLElement) {
  return container.querySelectorAll('[data-filled="true"]').length
}

describe('StarRating', () => {
  it('describes the rating for screen readers', () => {
    render(<StarRating rating={4.3} />)
    expect(screen.getByRole('img', { name: 'Rated 4.3 out of 5' })).toBeInTheDocument()
  })

  it('fills the stars rounded to the nearest whole star', () => {
    expect(filledStars(render(<StarRating rating={4.3} />).container)).toBe(4)
    expect(filledStars(render(<StarRating rating={4.5} />).container)).toBe(5)
    expect(filledStars(render(<StarRating rating={1} />).container)).toBe(1)
  })
})

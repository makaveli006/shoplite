import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StarPicker } from './StarPicker'

describe('StarPicker', () => {
  it('offers five stars like radio buttons, with the chosen one checked', () => {
    render(<StarPicker value={3} onChange={() => {}} />)

    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '1 star' })).toHaveAttribute('aria-checked', 'false')
  })

  it('reports the clicked star', () => {
    const onChange = vi.fn()
    render(<StarPicker value={0} onChange={onChange} />)

    fireEvent.click(screen.getByRole('radio', { name: '4 stars' }))

    expect(onChange).toHaveBeenCalledWith(4)
  })
})

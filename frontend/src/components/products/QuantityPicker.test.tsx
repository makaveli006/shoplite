import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { QuantityPicker } from './QuantityPicker'

describe('QuantityPicker', () => {
  it('shows the value and reports clicks', async () => {
    const onChange = vi.fn() // a stand-in function that records how it was called
    render(<QuantityPicker value={2} max={5} onChange={onChange} />)

    expect(screen.getByText('2')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'One more' }))
    expect(onChange).toHaveBeenCalledWith(3)
    await userEvent.click(screen.getByRole('button', { name: 'One less' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('cannot go below 1 or above the stock', () => {
    const { rerender } = render(<QuantityPicker value={1} max={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'One less' })).toBeDisabled()

    rerender(<QuantityPicker value={5} max={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'One more' })).toBeDisabled()
  })
})

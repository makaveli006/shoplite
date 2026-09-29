import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchProductSuggestions } from '@/api/catalog'
import { makeSuggestion } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'

import { SearchBox } from './SearchBox'

vi.mock('@/api/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/catalog')>()),
  fetchProductSuggestions: vi.fn(),
}))

const onSubmit = vi.fn()

/** The search box inside a form, like in the filter bar, plus a product page to land on. */
function SearchForm() {
  const [text, setText] = useState('')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(text)
      }}
    >
      <SearchBox value={text} onChange={setText} />
    </form>
  )
}

function showSearchBox() {
  renderWithProviders(
    <Routes>
      <Route path="/products" element={<SearchForm />} />
      <Route path="/products/:slug" element={<p>Product page</p>} />
    </Routes>,
    { route: '/products' },
  )
  return screen.getByRole('combobox', { name: 'Search products' })
}

describe('SearchBox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchProductSuggestions).mockResolvedValue([
      makeSuggestion(),
      makeSuggestion({ id: 22, name: 'Bluetooth Speaker', slug: 'bluetooth-speaker', price: '39.00' }),
    ])
  })

  it('suggests products while typing', async () => {
    const input = showSearchBox()

    await userEvent.type(input, 'hea')

    expect(await screen.findByRole('option', { name: /Noise-Cancelling Headphones/ })).toBeInTheDocument()
    expect(fetchProductSuggestions).toHaveBeenCalledWith('hea') // once typing paused, not per letter
    expect(fetchProductSuggestions).toHaveBeenCalledTimes(1)
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens the highlighted suggestion with the arrow keys and Enter', async () => {
    const input = showSearchBox()
    await userEvent.type(input, 'hea')
    await screen.findByRole('option', { name: /Headphones/ })

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('option', { name: /Bluetooth Speaker/ })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Enter}')

    expect(await screen.findByText('Product page')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('runs a normal search when Enter is pressed without choosing a suggestion', async () => {
    const input = showSearchBox()
    await userEvent.type(input, 'hea')
    await screen.findByRole('option', { name: /Headphones/ })

    await userEvent.keyboard('{Enter}')

    expect(onSubmit).toHaveBeenCalledWith('hea')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes the suggestions with Escape', async () => {
    const input = showSearchBox()
    await userEvent.type(input, 'hea')
    await screen.findByRole('listbox')

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveValue('hea') // the text stays
  })

  it("doesn't ask for suggestions for a single letter", async () => {
    const input = showSearchBox()

    await userEvent.type(input, 'h')
    await new Promise((resolve) => setTimeout(resolve, 400)) // longer than the typing pause

    await waitFor(() => expect(fetchProductSuggestions).not.toHaveBeenCalled())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

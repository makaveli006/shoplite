import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'

import { AuthContext, type AuthContextValue } from '@/auth/context'

interface Options {
  route?: string
  /** Who is "logged in" during the test. Default: nobody (a visitor). See signedIn() in fixtures.ts. */
  auth?: Partial<AuthContextValue>
}

/**
 * Draw a component the way the real app would: with the data memory (TanStack Query),
 * the router starting at the given web address, and the login state. A new, empty memory
 * for every test.
 */
export function renderWithProviders(ui: ReactElement, { route = '/', auth }: Options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // fail immediately in tests, no retries
  })
  // A stand-in for AuthProvider: no real login requests, just the values the components read.
  const authValue: AuthContextValue = {
    user: null,
    status: 'anonymous',
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    ...auth,
  }
  // As a "wrapper", the providers stay in place when a test calls rerender(<NewUi />).
  function Providers({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    )
  }
  return render(ui, { wrapper: Providers })
}

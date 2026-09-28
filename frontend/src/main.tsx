import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { isAxiosError } from 'axios'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'

import { AuthProvider } from './auth/AuthProvider'
import './index.css'
import { router } from './router'

// The memory for everything loaded from the API.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data younger than 30 seconds is used as-is; older data is shown AND quietly re-checked.
      staleTime: 30_000,
      // Try failed requests once more, but not when the server clearly said no (4xx, e.g. 404).
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status && status >= 400 && status < 500) return false
        return failureCount < 1
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {/* A panel to inspect what's been loaded (only shown while developing). */}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  </StrictMode>,
)

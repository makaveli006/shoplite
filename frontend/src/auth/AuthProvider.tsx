import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { fetchMe, obtainTokens, refreshAccessToken, registerAccount, type RegisterData } from '@/api/auth'
import { tokens } from '@/lib/tokens'
import type { User } from '@/types/api'

import { AuthContext, type AuthStatus, type AuthContextValue } from './context'

/** Keeps track of the logged-in user for the whole app. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => (tokens.getRefresh() ? 'loading' : 'anonymous'))

  // When the page opens: if a refresh token was saved earlier, use it to log back in silently.
  useEffect(() => {
    const refresh = tokens.getRefresh()
    if (!refresh) return
    let cancelled = false
    ;(async () => {
      try {
        tokens.setAccess(await refreshAccessToken(refresh))
        const me = await fetchMe()
        if (!cancelled) {
          setUser(me)
          setStatus('authenticated')
        }
      } catch (error) {
        // An expired or invalid refresh token: forget it. (If the server is simply
        // unreachable, keep it, so the customer isn't logged out by a network hiccup.)
        if (isAxiosError(error) && error.response) tokens.clear()
        if (!cancelled) setStatus('anonymous')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const pair = await obtainTokens(email, password)
    tokens.save(pair.access, pair.refresh)
    const me = await fetchMe()
    setUser(me)
    setStatus('authenticated')
    return me
  }, [])

  const register = useCallback(
    async (values: RegisterData) => {
      await registerAccount(values)
      return login(values.email, values.password) // log straight in after registering
    },
    [login],
  )

  const logout = useCallback(() => {
    tokens.clear()
    setUser(null)
    setStatus('anonymous')
    queryClient.clear() // forget everything loaded for this user (cart, orders, ...)
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

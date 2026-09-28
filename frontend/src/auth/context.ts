import { createContext } from 'react'

import type { RegisterData } from '@/api/auth'
import type { User } from '@/types/api'

/** loading = still checking a saved login when the page opens. */
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  login: (email: string, password: string) => Promise<User>
  register: (values: RegisterData) => Promise<User>
  logout: () => void
  /** Replace the stored user after the profile was changed. */
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

import { useContext } from 'react'

import type { User } from '@/types/api'

import { AuthContext } from './context'

/** Who is logged in, and the login / register / logout actions. Usable in any component. */
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return value
}

/** "Ana" if a first name is set, otherwise the username. */
export function displayName(user: User) {
  return user.first_name || user.username
}

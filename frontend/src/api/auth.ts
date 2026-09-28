import { api } from '@/lib/api'
import type { TokenPair, User } from '@/types/api'

export interface RegisterData {
  email: string
  username: string
  password: string
  first_name?: string
  last_name?: string
}

export async function obtainTokens(email: string, password: string): Promise<TokenPair> {
  const { data } = await api.post<TokenPair>('/auth/token/', { email, password })
  return data
}

export async function refreshAccessToken(refresh: string): Promise<string> {
  const { data } = await api.post<{ access: string }>('/auth/token/refresh/', { refresh })
  return data.access
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me/')
  return data
}

export async function registerAccount(values: RegisterData): Promise<void> {
  await api.post('/auth/register/', values)
}

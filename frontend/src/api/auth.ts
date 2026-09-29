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

export async function requestPasswordReset(email: string): Promise<string> {
  const { data } = await api.post<{ detail: string }>('/auth/password-reset/', { email })
  return data.detail
}

export async function confirmPasswordReset(uid: string, token: string, newPassword: string): Promise<string> {
  const { data } = await api.post<{ detail: string }>('/auth/password-reset/confirm/', {
    uid,
    token,
    new_password: newPassword,
  })
  return data.detail
}

export interface ProfileData {
  first_name: string
  last_name: string
  username: string
}

export async function updateMe(values: ProfileData): Promise<User> {
  const { data } = await api.patch<User>('/auth/me/', values)
  return data
}

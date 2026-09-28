import axios, { isAxiosError } from 'axios'

import { tokens } from './tokens'

/** One shared connection to the Django API. Every request made with it starts with VITE_API_URL. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000, // give up after 10 seconds instead of waiting forever
})

// Before every request: if we're logged in, attach the access token.
api.interceptors.request.use((config) => {
  const access = tokens.getAccess()
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

/** A short, human message for any error that came from talking to the API. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the shop server. Is the backend running?'
    }
    const detail = error.response.data?.detail
    if (typeof detail === 'string') {
      return detail
    }
    return `The server answered with an error (${error.response.status}).`
  }
  return 'Something went wrong.'
}

/** Field-by-field messages from a 400 answer, e.g. { email: ["An account with this email already exists."] } */
export function getFieldErrors(error: unknown): Record<string, string[]> {
  if (isAxiosError(error) && error.response?.status === 400 && typeof error.response.data === 'object') {
    return error.response.data as Record<string, string[]>
  }
  return {}
}

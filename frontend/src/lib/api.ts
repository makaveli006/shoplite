import axios, { isAxiosError, type AxiosError } from 'axios'

import { tokens } from './tokens'

const baseURL = import.meta.env.VITE_API_URL

/** One shared connection to the Django API. Every request made with it starts with VITE_API_URL. */
export const api = axios.create({
  baseURL,
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

// ---------------------------------------------------------------------------
// Automatic renewal of the access token.
//
// When a request fails with 401 (usually: the 15-minute access token expired),
// we use the refresh token to get a new access token and repeat the request once.
// If several requests fail at the same moment, they all wait for ONE renewal.
// If the refresh token itself is no longer valid, the session is over.
// ---------------------------------------------------------------------------

let renewal: Promise<string> | null = null
const alreadyRetried = new WeakSet<object>()
let onSessionExpired: () => void = () => {}

/** Lets the login state (AuthProvider) react when the session can't be renewed. */
export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler
}

async function renewAccessToken(refresh: string): Promise<string> {
  // A plain request (not through `api`), so this call itself is never intercepted.
  const { data } = await axios.post<{ access: string }>(`${baseURL}/auth/token/refresh/`, { refresh })
  tokens.setAccess(data.access)
  return data.access
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config
    const refresh = tokens.getRefresh()
    const isLoginCall = request?.url?.startsWith('/auth/token/')

    if (error.response?.status !== 401 || !request || !refresh || isLoginCall || alreadyRetried.has(request)) {
      throw error
    }

    alreadyRetried.add(request)
    try {
      renewal ??= renewAccessToken(refresh).finally(() => {
        renewal = null
      })
      const access = await renewal
      request.headers.Authorization = `Bearer ${access}`
      return api(request) // repeat the original request with the new token
    } catch (renewError) {
      // The server rejected the refresh token (expired/invalid): the customer must sign in again.
      // A network problem is not a reason to sign anyone out.
      if (isAxiosError(renewError) && renewError.response) {
        tokens.clear()
        onSessionExpired()
      }
      throw error
    }
  },
)

/** A short, human message for any error that came from talking to the API. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the shop server. Is the backend running?'
    }
    const detail = (error.response.data as { detail?: unknown } | undefined)?.detail
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

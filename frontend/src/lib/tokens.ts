/**
 * Where the login tokens are kept.
 *
 * - The ACCESS token (valid 15 minutes, sent with every request) lives only in memory.
 *   It disappears when the tab is closed or reloaded, so it's hard for anything else to steal.
 * - The REFRESH token (valid 7 days, only used to get new access tokens) is kept in the
 *   browser's localStorage, so the customer stays logged in after a reload.
 */
const REFRESH_KEY = 'shoplite.refresh'

let accessToken: string | null = null

export const tokens = {
  getAccess: () => accessToken,
  setAccess: (token: string) => {
    accessToken = token
  },
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  save: (access: string, refresh: string) => {
    accessToken = access
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    accessToken = null
    localStorage.removeItem(REFRESH_KEY)
  },
}

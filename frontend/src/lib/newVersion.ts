// Reload the page once when the shop was updated while it was open.
//
// Why: most pages are downloaded only when first opened (lazy routes in router.tsx). Their file
// names contain a fingerprint (assets/CartPage-a1b2c3.js), and every deploy uploads new files and
// deletes the old ones. Someone who opened the shop before a deploy still runs the old version,
// which asks for the old file name, which no longer exists: the page would fail to load.
// Vite fires 'vite:preloadError' in exactly that case. Reloading fetches the new index.html
// (served with no-cache) and therefore the new file names.

const LAST_RELOAD_KEY = 'shoplite.reloadedForNewVersion'

// If the file is still missing right after a reload, the problem isn't an old version (the server
// may be down): don't reload again and again, let the normal error page show instead.
const RELOAD_GUARD_MS = 10_000

type Options = {
  reload?: () => void
  storage?: Pick<Storage, 'getItem' | 'setItem'>
  now?: () => number
}

/** Handles one 'vite:preloadError' event. Returns true if it reloaded the page. */
export function reloadForNewVersion(event: Event, options: Options = {}): boolean {
  const { reload = () => window.location.reload(), storage = window.sessionStorage, now = Date.now } = options

  let lastReload = 0
  try {
    lastReload = Number(storage.getItem(LAST_RELOAD_KEY)) || 0
  } catch {
    // Storage can be blocked (private mode, strict settings): then simply reload without the guard.
  }
  if (now() - lastReload < RELOAD_GUARD_MS) return false

  event.preventDefault() // the reload replaces the page, so don't also show the error
  try {
    storage.setItem(LAST_RELOAD_KEY, String(now()))
  } catch {
    // see above
  }
  reload()
  return true
}

export function watchForNewVersion(): void {
  window.addEventListener('vite:preloadError', (event) => {
    reloadForNewVersion(event)
  })
}

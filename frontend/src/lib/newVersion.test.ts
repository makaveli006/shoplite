import { describe, expect, it, vi } from 'vitest'

import { reloadForNewVersion } from './newVersion'

// A tiny in-memory stand-in for sessionStorage.
function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

function preloadError() {
  return new Event('vite:preloadError', { cancelable: true })
}

describe('reloadForNewVersion', () => {
  it('reloads the page when a file of the old version is missing', () => {
    const reload = vi.fn()
    const event = preloadError()

    const reloaded = reloadForNewVersion(event, { reload, storage: memoryStorage(), now: () => 50_000 })

    expect(reloaded).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(true) // no error page flashes before the reload
  })

  it('does not reload again right after a reload (no endless loop)', () => {
    const reload = vi.fn()
    const storage = memoryStorage()
    let time = 50_000

    reloadForNewVersion(preloadError(), { reload, storage, now: () => time })
    time += 3_000 // the file is still missing 3 seconds later: something else is wrong
    const event = preloadError()
    const reloadedAgain = reloadForNewVersion(event, { reload, storage, now: () => time })

    expect(reloadedAgain).toBe(false)
    expect(reload).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(false) // the normal error handling takes over
  })

  it('reloads again for a later deploy', () => {
    const reload = vi.fn()
    const storage = memoryStorage()
    let time = 50_000

    reloadForNewVersion(preloadError(), { reload, storage, now: () => time })
    time += 60 * 60_000 // an hour later, another deploy
    reloadForNewVersion(preloadError(), { reload, storage, now: () => time })

    expect(reload).toHaveBeenCalledTimes(2)
  })

  it('still reloads when the browser blocks storage', () => {
    const reload = vi.fn()
    const blocked = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }

    expect(reloadForNewVersion(preloadError(), { reload, storage: blocked })).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
  })
})

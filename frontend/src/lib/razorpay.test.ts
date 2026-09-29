import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const SCRIPT = 'script[src="https://checkout.razorpay.com/v1/checkout.js"]'

// The loader remembers its download between calls, so every test gets a fresh copy of the module.
async function freshLoader() {
  vi.resetModules()
  return (await import('./razorpay')).loadRazorpay
}

class FakeRazorpay {
  open() {}
  on() {}
}

describe('loadRazorpay', () => {
  beforeEach(() => {
    delete window.Razorpay
  })

  afterEach(() => {
    document.querySelectorAll(SCRIPT).forEach((script) => script.remove())
    delete window.Razorpay
  })

  it('adds the script only once and gives back the Razorpay class', async () => {
    const loadRazorpay = await freshLoader()

    const first = loadRazorpay()
    const second = loadRazorpay() // a second click while it is still downloading
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(1)

    window.Razorpay = FakeRazorpay // what the real script does when it has loaded
    document.querySelector(SCRIPT)!.dispatchEvent(new Event('load'))

    await expect(first).resolves.toBe(FakeRazorpay)
    await expect(second).resolves.toBe(FakeRazorpay)
    await expect(loadRazorpay()).resolves.toBe(FakeRazorpay) // afterwards: no new download
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(1)
  })

  it('reports a failed download and allows a fresh try', async () => {
    const loadRazorpay = await freshLoader()

    const attempt = loadRazorpay()
    document.querySelector(SCRIPT)!.dispatchEvent(new Event('error'))

    await expect(attempt).rejects.toThrow("Couldn't open the payment window")
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(0) // the broken script is removed

    loadRazorpay() // the next click tries again
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(1)
  })
})

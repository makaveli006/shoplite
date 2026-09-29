import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { startPayment, verifyPayment } from '@/api/payments'
import { loadRazorpay, type RazorpayFailure, type RazorpayOptions } from '@/lib/razorpay'
import { makeOrder } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'
import type { PaymentStart } from '@/types/api'

import { PayButton } from './PayButton'

vi.mock('@/api/payments', () => ({ startPayment: vi.fn(), verifyPayment: vi.fn() }))
vi.mock('@/lib/razorpay', () => ({ loadRazorpay: vi.fn() }))
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }))

const DETAILS: PaymentStart = {
  key_id: 'rzp_test_dummy',
  razorpay_order_id: 'order_TEST1',
  amount: 4999,
  currency: 'INR',
  name: 'ShopLite',
  description: 'Order #15',
  prefill: { name: 'Ana Silva', email: 'ana@example.com', contact: '9876543210' },
  test_mode: true,
}
const RECEIPT = { razorpay_order_id: 'order_TEST1', razorpay_payment_id: 'pay_TEST1', razorpay_signature: 'abc123' }

/** A stand-in for Razorpay's payment window: it remembers how it was opened. */
let windows: FakeRazorpay[] = []
class FakeRazorpay {
  options: RazorpayOptions
  opened = false
  onFailed?: (response: RazorpayFailure) => void
  constructor(options: RazorpayOptions) {
    this.options = options
    windows.push(this)
  }
  open() {
    this.opened = true
  }
  on(_event: 'payment.failed', callback: (response: RazorpayFailure) => void) {
    this.onFailed = callback
  }
}

const PAY = /Pay .*49\.99 now/

async function openWindow() {
  await userEvent.click(screen.getByRole('button', { name: PAY }))
  await waitFor(() => expect(windows[0]?.opened).toBe(true))
  return windows[0]
}

describe('PayButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    windows = []
    vi.mocked(startPayment).mockResolvedValue(DETAILS)
    vi.mocked(loadRazorpay).mockResolvedValue(FakeRazorpay)
  })

  it('opens the payment window with the details from our server', async () => {
    renderWithProviders(<PayButton order={makeOrder()} />)

    const paymentWindow = await openWindow()

    expect(startPayment).toHaveBeenCalledWith(15)
    expect(paymentWindow.options).toMatchObject({
      key: 'rzp_test_dummy',
      order_id: 'order_TEST1',
      amount: 4999,
      currency: 'INR',
      prefill: { email: 'ana@example.com' },
    })
  })

  it('hands the signed receipt to our server after a successful payment', async () => {
    vi.mocked(verifyPayment).mockResolvedValue(makeOrder({ status: 'paid', status_display: 'Paid' }))
    renderWithProviders(<PayButton order={makeOrder()} />)
    const paymentWindow = await openWindow()

    act(() => paymentWindow.options.handler(RECEIPT))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Payment received. Thank you!'))
    expect(vi.mocked(verifyPayment).mock.calls[0][0]).toEqual(RECEIPT)
  })

  it('does nothing more when the window is closed without paying', async () => {
    renderWithProviders(<PayButton order={makeOrder()} />)
    const paymentWindow = await openWindow()

    act(() => paymentWindow.options.modal?.ondismiss?.())

    expect(toast).toHaveBeenCalledWith('Payment not completed. You can pay any time from this page.')
    expect(verifyPayment).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: PAY })).toBeEnabled() // ready to try again
  })

  it("shows Razorpay's reason when a payment fails", async () => {
    renderWithProviders(<PayButton order={makeOrder()} />)
    const paymentWindow = await openWindow()

    act(() => paymentWindow.onFailed?.({ error: { code: 'BAD_REQUEST_ERROR', description: 'Your card was declined.' } }))

    expect(toast.error).toHaveBeenCalledWith('Payment failed: Your card was declined.')
    expect(verifyPayment).not.toHaveBeenCalled()
  })

  it("explains when online payment isn't available", async () => {
    const response = { status: 503, data: { detail: 'Online payment is not set up for this shop yet.' } }
    vi.mocked(startPayment).mockRejectedValue(
      new AxiosError('Service Unavailable', 'ERR_BAD_RESPONSE', undefined, undefined, response as AxiosResponse),
    )
    renderWithProviders(<PayButton order={makeOrder()} />)

    await userEvent.click(screen.getByRole('button', { name: PAY }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Online payment is not set up for this shop yet.'))
    expect(windows).toHaveLength(0)
  })

  it('opens the window by itself only once when asked to', async () => {
    const { rerender } = renderWithProviders(<PayButton order={makeOrder()} autoOpen />)
    await waitFor(() => expect(windows).toHaveLength(1))

    rerender(<PayButton order={makeOrder()} autoOpen />)

    await waitFor(() => expect(screen.getByRole('button', { name: PAY })).toBeEnabled())
    expect(windows).toHaveLength(1)
  })
})

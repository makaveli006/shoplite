import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchOrder } from '@/api/orders'
import { startPayment } from '@/api/payments'
import { loadRazorpay, type RazorpayOptions } from '@/lib/razorpay'
import { makeOrder, makeUser, signedIn } from '@/test/fixtures'
import { renderWithProviders } from '@/test/render'

import { OrderDetailPage } from './OrderDetailPage'

vi.mock('@/api/orders', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/orders')>()),
  fetchOrder: vi.fn(),
}))
vi.mock('@/api/payments', () => ({ startPayment: vi.fn(), verifyPayment: vi.fn() }))
vi.mock('@/lib/razorpay', () => ({ loadRazorpay: vi.fn() }))

let openedWindows = 0
class FakeRazorpay {
  constructor(_options: RazorpayOptions) {}
  open() {
    openedWindows += 1
  }
  on() {}
}

const PAY = /Pay .*49\.99 now/

function showOrder({ route = '/orders/15', auth = signedIn() } = {}) {
  renderWithProviders(
    <Routes>
      <Route path="/orders/:id" element={<OrderDetailPage />} />
    </Routes>,
    { route, auth },
  )
}

describe('OrderDetailPage payment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    openedWindows = 0
    vi.mocked(loadRazorpay).mockResolvedValue(FakeRazorpay)
    vi.mocked(startPayment).mockResolvedValue({
      key_id: 'rzp_test_dummy',
      razorpay_order_id: 'order_TEST1',
      amount: 4999,
      currency: 'INR',
      name: 'ShopLite',
      description: 'Order #15',
      prefill: { name: 'Ana Silva', email: 'ana@example.com', contact: '' },
      test_mode: true,
    })
  })

  it('lets me pay (or cancel) my pending order', async () => {
    vi.mocked(fetchOrder).mockResolvedValue(makeOrder())
    showOrder()

    expect(await screen.findByRole('button', { name: PAY })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel order' })).toBeInTheDocument()
    expect(openedWindows).toBe(0) // nothing opens by itself without ?pay=1
  })

  it('has nothing to pay once the order is paid', async () => {
    vi.mocked(fetchOrder).mockResolvedValue(makeOrder({ status: 'paid', status_display: 'Paid' }))
    showOrder()

    expect(await screen.findByText('Order #15')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: PAY })).not.toBeInTheDocument()
  })

  it("doesn't offer staff to pay a customer's order", async () => {
    vi.mocked(fetchOrder).mockResolvedValue(makeOrder())
    showOrder({ auth: signedIn(makeUser({ email: 'admin@example.com', is_staff: true })) })

    expect(await screen.findByText('Order #15')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: PAY })).not.toBeInTheDocument()
  })

  it('opens the payment window right after checkout, once', async () => {
    vi.mocked(fetchOrder).mockResolvedValue(makeOrder())
    showOrder({ route: '/orders/15?placed=1&pay=1' })

    expect(await screen.findByText(/Complete the payment to confirm it/)).toBeInTheDocument()
    await waitFor(() => expect(openedWindows).toBe(1))
    expect(startPayment).toHaveBeenCalledTimes(1)
  })
})

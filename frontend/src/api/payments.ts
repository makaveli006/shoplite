import { api } from '@/lib/api'
import type { RazorpayReceipt } from '@/lib/razorpay'
import type { Order, PaymentStart } from '@/types/api'

/** Ask our server to open a Razorpay payment for my pending order. */
export async function startPayment(orderId: number): Promise<PaymentStart> {
  const { data } = await api.post<PaymentStart>('/payments/start/', { order_id: orderId })
  return data
}

/** Hand the payment window's signed receipt to our server, which checks it. Returns the paid order. */
export async function verifyPayment(receipt: RazorpayReceipt): Promise<Order> {
  const { data } = await api.post<Order>('/payments/verify/', receipt)
  return data
}

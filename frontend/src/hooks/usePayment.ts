import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

import { startPayment, verifyPayment } from '@/api/payments'
import { getErrorMessage } from '@/lib/api'
import { loadRazorpay, type RazorpayReceipt } from '@/lib/razorpay'

/** Our server's message, or the message of a problem in the browser (e.g. the script didn't load). */
function paymentErrorMessage(error: unknown) {
  return error instanceof Error && !isAxiosError(error) ? error.message : getErrorMessage(error)
}

/**
 * Paying an order, start to finish:
 * 1. our server opens a Razorpay payment for the order (it decides the amount),
 * 2. Razorpay's payment window opens on top of the shop,
 * 3. after a successful payment, its signed receipt goes to our server, which checks it and
 *    marks the order paid. (Razorpay's webhook confirms it too, even if this step never happens.)
 */
export function usePayOrder(orderId: number) {
  const queryClient = useQueryClient()
  const [opening, setOpening] = useState(false)

  const verifyMutation = useMutation({
    mutationFn: (receipt: RazorpayReceipt) => verifyPayment(receipt),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order) // the page shows "Paid" at once
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Payment received. Thank you!')
    },
    onError: (error) => toast.error(paymentErrorMessage(error)),
  })

  async function pay() {
    setOpening(true)
    try {
      // Both at the same time: our server's answer and Razorpay's script.
      const [details, Razorpay] = await Promise.all([startPayment(orderId), loadRazorpay()])
      const checkout = new Razorpay({
        key: details.key_id,
        amount: details.amount,
        currency: details.currency,
        name: details.name,
        description: details.description,
        order_id: details.razorpay_order_id,
        prefill: details.prefill,
        theme: { color: '#171717' },
        handler: (receipt) => verifyMutation.mutate(receipt),
        modal: {
          ondismiss: () => toast('Payment not completed. You can pay any time from this page.'),
        },
      })
      // A declined card etc.: Razorpay's window lets the customer try again straight away.
      checkout.on('payment.failed', (response) => toast.error(`Payment failed: ${response.error.description}`))
      checkout.open()
    } catch (error) {
      toast.error(paymentErrorMessage(error))
    } finally {
      setOpening(false)
    }
  }

  return { pay, busy: opening || verifyMutation.isPending }
}

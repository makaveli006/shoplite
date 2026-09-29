import { CreditCard } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { usePayOrder } from '@/hooks/usePayment'
import { formatPrice } from '@/lib/format'
import type { Order } from '@/types/api'

interface Props {
  order: Order
  /** Open the payment window right away (once), e.g. just after placing the order. */
  autoOpen?: boolean
}

/** "Pay ₹49.99 now": opens Razorpay's payment window for a pending order. */
export function PayButton({ order, autoOpen = false }: Props) {
  const { pay, busy } = usePayOrder(order.id)
  // Remembers that the window was opened automatically, so it never opens twice by itself
  // (React may run effects twice while developing, and the page re-renders often).
  const autoOpened = useRef(false)

  useEffect(() => {
    if (autoOpen && !autoOpened.current) {
      autoOpened.current = true
      pay()
    }
  }, [autoOpen, pay])

  return (
    <Button size="lg" onClick={pay} disabled={busy}>
      <CreditCard /> {busy ? 'Opening payment...' : `Pay ${formatPrice(order.total_amount)} now`}
    </Button>
  )
}

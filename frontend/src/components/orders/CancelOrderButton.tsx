import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCancelOrder } from '@/hooks/useOrders'
import { getErrorMessage } from '@/lib/api'

/** "Cancel order" with a confirmation dialog. Only shown for pending orders. */
export function CancelOrderButton({ orderId }: { orderId: number }) {
  const [open, setOpen] = useState(false)
  const cancelMutation = useCancelOrder()

  function confirm() {
    cancelMutation.mutate(orderId, {
      onSuccess: () => {
        setOpen(false)
        toast.success(`Order #${orderId} was cancelled.`)
      },
      // e.g. the shop marked it as paid in the meantime: "... can no longer be cancelled. Please contact us."
      onError: (error) => {
        setOpen(false)
        toast.error(getErrorMessage(error))
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Cancel order
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel order #{orderId}?</DialogTitle>
          <DialogDescription>The order will be cancelled and nothing will be sent. This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep my order</Button>
          </DialogClose>
          <Button variant="destructive" onClick={confirm} disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

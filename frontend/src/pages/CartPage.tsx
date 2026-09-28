import { AlertCircle, ImageOff, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { QuantityPicker } from '@/components/products/QuantityPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart'
import { getErrorMessage, getFirstErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { CartItem } from '@/types/api'

export function CartPage() {
  const cart = useCart()

  if (cart.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  if (cart.isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <AlertCircle className="size-8 text-destructive" />
        <p className="font-medium">Couldn't load your cart.</p>
        <p className="text-sm text-muted-foreground">{getErrorMessage(cart.error)}</p>
        <Button variant="outline" onClick={() => cart.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const { items, item_count, total, has_issues } = cart.data

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <title>Your cart | ShopLite</title>
        <ShoppingBag className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-muted-foreground">Find something you like and add it to your cart.</p>
        <Button asChild>
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <title>Your cart | ShopLite</title>
      <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardContent className="flex flex-col">
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator className="my-4" />}
                <CartLine item={item} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span>{item_count}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {has_issues && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                Some items can't be bought right now. Please fix the marked lines first.
              </p>
            )}
          </CardContent>
          <CardFooter className="mt-2 flex-col gap-2">
            {has_issues ? (
              <Button className="w-full" disabled>
                Proceed to checkout
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
            )}
            <EmptyCartButton />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function CartLine({ item }: { item: CartItem }) {
  const updateMutation = useUpdateCartItem()
  const removeMutation = useRemoveCartItem()
  const busy = updateMutation.isPending || removeMutation.isPending
  const { product } = item

  function changeQuantity(quantity: number) {
    updateMutation.mutate({ itemId: item.id, quantity }, { onError: (error) => toast.error(getFirstErrorMessage(error)) })
  }

  function remove() {
    removeMutation.mutate(item.id, {
      onSuccess: () => toast(`${product.name} was removed from your cart.`),
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <div className={cn('flex gap-4 transition-opacity', busy && 'opacity-60')}>
      <Link to={`/products/${product.slug}`} className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <img src={product.image} alt={product.name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" aria-hidden />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div>
            <Link to={`/products/${product.slug}`} className="font-medium hover:underline">
              {product.name}
            </Link>
            <p className="text-sm text-muted-foreground">{formatPrice(product.price)} each</p>
          </div>
          <p className="font-semibold">{formatPrice(item.line_total)}</p>
        </div>

        {item.issue && <p className="text-sm font-medium text-destructive">{item.issue}</p>}

        <div className="flex items-center justify-between">
          <QuantityPicker value={item.quantity} max={product.stock} onChange={changeQuantity} />
          <Button variant="ghost" size="sm" onClick={remove} disabled={busy}>
            <Trash2 /> Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

/** "Empty cart" asks for confirmation in a dialog first. */
function EmptyCartButton() {
  const [open, setOpen] = useState(false)
  const clearMutation = useClearCart()

  function confirm() {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
        setOpen(false)
        toast('Your cart is now empty.')
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" className="w-full" onClick={() => setOpen(true)}>
        Empty cart
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Empty your cart?</DialogTitle>
          <DialogDescription>All items will be removed. This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep my items</Button>
          </DialogClose>
          <Button variant="destructive" onClick={confirm} disabled={clearMutation.isPending}>
            {clearMutation.isPending ? 'Emptying...' : 'Empty cart'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

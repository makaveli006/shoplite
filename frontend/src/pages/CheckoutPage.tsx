import { isAxiosError } from 'axios'
import { AlertCircle, ShoppingBag } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { useAuth } from '@/auth/useAuth'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useOrders'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import type { ShippingAddress } from '@/types/api'

/** The "problems" list the API returns when it refuses a checkout (e.g. stock ran out). */
function getCheckoutProblems(error: unknown): string[] {
  if (isAxiosError(error)) {
    const problems = (error.response?.data as { problems?: unknown } | undefined)?.problems
    if (Array.isArray(problems)) return problems.map(String)
  }
  return []
}

export function CheckoutPage() {
  const { user } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const checkoutMutation = useCheckout()

  const [form, setForm] = useState<ShippingAddress>({
    full_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  })

  function field(name: keyof ShippingAddress) {
    return {
      value: form[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: event.target.value }),
    }
  }

  function placeOrder(event: FormEvent) {
    event.preventDefault()
    checkoutMutation.mutate(form, {
      // Straight to the confirmation page; "replace" so Back doesn't return to a finished checkout.
      onSuccess: (order) => navigate(`/orders/${order.id}?placed=1`, { replace: true }),
    })
  }

  if (cart.isPending) {
    return <Skeleton className="h-96 w-full" />
  }

  if (cart.isError) {
    return <p className="text-destructive">{getErrorMessage(cart.error)}</p>
  }

  // Nothing to buy (e.g. the page was opened directly, or the order was just placed in another tab).
  if (cart.data.items.length === 0 && !checkoutMutation.isPending) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Button asChild>
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  const problems = getCheckoutProblems(checkoutMutation.error)
  const fieldErrors = getFieldErrors(checkoutMutation.error)
  const otherError = checkoutMutation.isError && !problems.length && !Object.keys(fieldErrors).length

  return (
    <form onSubmit={placeOrder} className="flex flex-col gap-6">
      <title>Checkout | ShopLite</title>
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      {(problems.length > 0 || cart.data.has_issues) && (
        <div role="alert" className="flex flex-col gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4" /> We couldn't place your order. Nothing was charged.
          </p>
          <ul className="list-inside list-disc">
            {(problems.length ? problems : ['Some items in your cart can no longer be bought as they are.']).map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <Link to="/cart" className="font-medium underline underline-offset-4">
            Review your cart
          </Link>
        </div>
      )}

      {otherError && (
        <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(checkoutMutation.error)}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipping address</CardTitle>
            <CardDescription>Where should we send your order?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField id="full_name" label="Full name" autoComplete="name" required {...field('full_name')} errors={fieldErrors.full_name} />
            <FormField id="address" label="Address" autoComplete="street-address" required {...field('address')} errors={fieldErrors.address} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="postal_code" label="Postal code" autoComplete="postal-code" required {...field('postal_code')} errors={fieldErrors.postal_code} />
              <FormField id="city" label="City" autoComplete="address-level2" required {...field('city')} errors={fieldErrors.city} />
            </div>
            <FormField id="country" label="Country" autoComplete="country-name" required {...field('country')} errors={fieldErrors.country} />
            <FormField id="phone" label="Phone (optional)" type="tel" autoComplete="tel" {...field('phone')} errors={fieldErrors.phone} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your order</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {cart.data.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.quantity} × {item.product.name}
                </span>
                <span className="shrink-0">{formatPrice(item.line_total)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(cart.data.total)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              No payment is taken now. Your order is placed as <em>pending</em> and the shop confirms the payment.
            </p>
          </CardContent>
          <CardFooter className="mt-2">
            <Button type="submit" size="lg" className="w-full" disabled={checkoutMutation.isPending || cart.data.has_issues}>
              {checkoutMutation.isPending ? 'Placing your order...' : 'Place order'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}

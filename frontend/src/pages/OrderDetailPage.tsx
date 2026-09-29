import { isAxiosError } from 'axios'
import { CheckCircle2, PackageX } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'

import { useAuth } from '@/auth/useAuth'
import { CancelOrderButton } from '@/components/orders/CancelOrderButton'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrder } from '@/hooks/useOrders'
import { getErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'

export function OrderDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const justPlaced = searchParams.get('placed') === '1'
  const order = useOrder(Number(id))
  const { user } = useAuth()

  if (order.isPending) {
    return <Skeleton className="h-96 w-full" />
  }

  if (order.isError) {
    const notFound = isAxiosError(order.error) && order.error.response?.status === 404
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <PackageX className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">{notFound ? 'Order not found' : "Couldn't load this order"}</h1>
        {!notFound && <p className="text-sm text-muted-foreground">{getErrorMessage(order.error)}</p>}
        <Button asChild>
          <Link to="/orders">See my orders</Link>
        </Button>
      </div>
    )
  }

  const data = order.data
  const placedOn = new Date(data.created_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className="flex flex-col gap-6">
      <title>{`Order #${data.id} | ShopLite`}</title>

      {justPlaced && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-200">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">Thank you! Your order #{data.id} has been placed.</p>
            <p className="text-sm">A confirmation email is on its way to {data.customer_email}.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{data.id}</h1>
          <p className="text-sm text-muted-foreground">Placed on {placedOn}</p>
        </div>
        <OrderStatusBadge status={data.status} label={data.status_display} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.quantity} ×{' '}
                  {item.product_slug ? (
                    <Link to={`/products/${item.product_slug}`} className="hover:underline">
                      {item.product_name}
                    </Link>
                  ) : (
                    item.product_name
                  )}{' '}
                  <span className="text-muted-foreground">@ {formatPrice(item.unit_price)}</span>
                </span>
                <span className="shrink-0">{formatPrice(item.line_total)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(data.total_amount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipping to</CardTitle>
            <CardDescription>
              {data.full_name}
              <br />
              {data.address}
              <br />
              {data.postal_code} {data.city}
              <br />
              {data.country}
              {data.phone && (
                <>
                  <br />
                  {data.phone}
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/orders" className="text-sm underline underline-offset-4">
          See all my orders
        </Link>
        {/* Only the customer who placed it cancels here; staff use Admin → Orders. */}
        {data.status === 'pending' && data.customer_email === user?.email && <CancelOrderButton orderId={data.id} />}
      </div>
    </div>
  )
}

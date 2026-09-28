import { AlertCircle, Receipt } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'

import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useOrders } from '@/hooks/useOrders'
import { getErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12 // the backend's page size

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const orders = useOrders(page)
  const navigate = useNavigate()

  function goToPage(newPage: number) {
    setSearchParams(newPage > 1 ? { page: String(newPage) } : {})
  }

  if (orders.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (orders.isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <AlertCircle className="size-8 text-destructive" />
        <p className="font-medium">Couldn't load your orders.</p>
        <p className="text-sm text-muted-foreground">{getErrorMessage(orders.error)}</p>
        <Button variant="outline" onClick={() => orders.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const { results, count, next } = orders.data
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  if (count === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <title>My orders | ShopLite</title>
        <Receipt className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="text-muted-foreground">When you place an order, it will appear here.</p>
        <Button asChild>
          <Link to="/products">Start shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <title>My orders | ShopLite</title>
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My orders</h1>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? 'order' : 'orders'}
        </p>
      </div>

      <Card className={cn('transition-opacity', orders.isPlaceholderData && 'opacity-60')}>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((order) => (
                // The whole row opens the order.
                <TableRow key={order.id} className="cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                  <TableCell className="font-medium">
                    <Link to={`/orders/${order.id}`} className="hover:underline" onClick={(event) => event.stopPropagation()}>
                      #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</TableCell>
                  <TableCell className="text-right">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell className="text-right">{formatPrice(order.total_amount)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} label={order.status_display} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Pages">
          <Button variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" disabled={!next || orders.isPlaceholderData} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        </nav>
      )}
    </div>
  )
}

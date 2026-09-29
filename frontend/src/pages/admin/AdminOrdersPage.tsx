import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminOrders, useSetOrderStatus } from '@/hooks/useOrders'
import { getErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types/api'

const PAGE_SIZE = 12
const ALL = 'all'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

// The buttons to offer for each status. This mirrors Order.ALLOWED_TRANSITIONS in the backend,
// which remains the real guard: a move that isn't allowed there is refused with a message.
const NEXT_STEPS: Record<OrderStatus, { status: OrderStatus; label: string }[]> = {
  pending: [
    { status: 'paid', label: 'Mark paid' },
    { status: 'cancelled', label: 'Cancel' },
  ],
  paid: [
    { status: 'shipped', label: 'Mark shipped' },
    { status: 'cancelled', label: 'Cancel' },
  ],
  shipped: [{ status: 'delivered', label: 'Mark delivered' }],
  delivered: [],
  cancelled: [],
}

export function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') ?? ''
  const search = searchParams.get('search') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const orders = useAdminOrders({ page, status, search })

  const [searchText, setSearchText] = useState(search)
  const [cancelling, setCancelling] = useState<Order | null>(null)
  const statusMutation = useSetOrderStatus()

  function changeFilter(key: 'status' | 'search', value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  function goToPage(newPage: number) {
    const next = new URLSearchParams(searchParams)
    if (newPage > 1) next.set('page', String(newPage))
    else next.delete('page')
    setSearchParams(next)
  }

  function applySearch(event: FormEvent) {
    event.preventDefault()
    changeFilter('search', searchText.trim())
  }

  function moveTo(order: Order, newStatus: OrderStatus) {
    statusMutation.mutate(
      { id: order.id, status: newStatus },
      {
        onSuccess: (saved) => toast.success(`Order #${saved.id} is now ${saved.status_display.toLowerCase()}.`),
        onError: (error) => toast.error(getErrorMessage(error)),
        onSettled: () => setCancelling(null),
      },
    )
  }

  const totalPages = orders.data ? Math.max(1, Math.ceil(orders.data.count / PAGE_SIZE)) : 1

  return (
    <div className="flex flex-col gap-4">
      <title>Orders · Store management | ShopLite</title>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={status || ALL} onValueChange={(value) => changeFilter('status', value === ALL ? '' : value)}>
          <SelectTrigger className="w-44" aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <form onSubmit={applySearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Customer email or name..."
            aria-label="Search orders"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="outline">
            <Search /> Search
          </Button>
        </form>
        {orders.data && <span className="ml-auto text-sm text-muted-foreground">{orders.data.count} orders</span>}
      </div>

      {orders.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : orders.isError ? (
        <p className="text-destructive">{getErrorMessage(orders.error)}</p>
      ) : (
        <Card className={cn('transition-opacity', orders.isPlaceholderData && 'opacity-60')}>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Next step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.results.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link to={`/orders/${order.id}`} className="hover:underline">
                        #{order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>{order.full_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</TableCell>
                    <TableCell className="text-right">{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} label={order.status_display} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {NEXT_STEPS[order.status].map((step) =>
                          step.status === 'cancelled' ? (
                            <Button key={step.status} variant="ghost" size="sm" onClick={() => setCancelling(order)}>
                              {step.label}
                            </Button>
                          ) : (
                            <Button
                              key={step.status}
                              variant="outline"
                              size="sm"
                              disabled={statusMutation.isPending}
                              onClick={() => moveTo(order, step.status)}
                            >
                              {step.label}
                            </Button>
                          ),
                        )}
                        {NEXT_STEPS[order.status].length === 0 && <span className="text-sm text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.data.results.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders match these filters.</p>
            )}
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Pages">
          <Button variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" disabled={!orders.data?.next || orders.isPlaceholderData} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        </nav>
      )}

      <ConfirmDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
        title={`Cancel order #${cancelling?.id}?`}
        description="The order is cancelled and its items go back into stock. This can't be undone."
        confirmLabel="Cancel order"
        pending={statusMutation.isPending}
        onConfirm={() => cancelling && moveTo(cancelling, 'cancelled')}
      />
    </div>
  )
}

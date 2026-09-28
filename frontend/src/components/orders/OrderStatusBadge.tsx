import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/api'

const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-900',
  paid: 'bg-sky-100 text-sky-900',
  shipped: 'bg-indigo-100 text-indigo-900',
  delivered: 'bg-emerald-100 text-emerald-900',
  cancelled: 'bg-muted text-muted-foreground line-through',
}

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return <Badge className={cn('border-transparent', STYLES[status])}>{label}</Badge>
}

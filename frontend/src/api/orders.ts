import { api } from '@/lib/api'
import type { Order, OrderStatus, Paginated, ShippingAddress } from '@/types/api'

export async function checkout(shipping: ShippingAddress): Promise<Order> {
  const { data } = await api.post<Order>('/orders/checkout/', shipping)
  return data
}

export async function fetchOrders(page: number): Promise<Paginated<Order>> {
  const { data } = await api.get<Paginated<Order>>('/orders/', { params: { page } })
  return data
}

export async function fetchOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}/`)
  return data
}

export interface AdminOrderFilters {
  page: number
  status?: string
  search?: string
}

/** Staff: every customer's orders (the API decides that from the login). */
export async function fetchAdminOrders(filters: AdminOrderFilters): Promise<Paginated<Order>> {
  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))
  const { data } = await api.get<Paginated<Order>>('/orders/', { params })
  return data
}

/** Staff: move an order to its next status (the API refuses moves that aren't allowed). */
export async function setOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${id}/status/`, { status })
  return data
}

export async function cancelOrder(id: number): Promise<Order> {
  const { data } = await api.post<Order>(`/orders/${id}/cancel/`)
  return data
}

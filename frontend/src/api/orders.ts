import { api } from '@/lib/api'
import type { Order, Paginated, ShippingAddress } from '@/types/api'

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

export async function cancelOrder(id: number): Promise<Order> {
  const { data } = await api.post<Order>(`/orders/${id}/cancel/`)
  return data
}

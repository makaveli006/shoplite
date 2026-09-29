import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  cancelOrder,
  checkout,
  fetchAdminOrders,
  fetchOrder,
  fetchOrders,
  setOrderStatus,
  type AdminOrderFilters,
} from '@/api/orders'
import type { OrderStatus, ShippingAddress } from '@/types/api'

import { CART_KEY } from './useCart'

export function useOrders(page: number) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => fetchOrders(page),
    placeholderData: keepPreviousData,
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
  })
}

/** Place an order. Afterwards the cart is empty and stock has changed, so those are reloaded. */
export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shipping: ShippingAddress) => checkout(shipping),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order) // the confirmation page opens instantly
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: CART_KEY })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
    // A refused checkout (e.g. stock ran out) may mean the cart now has problems: reload it.
    onError: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  })
}

/** Staff: all orders, filtered by status and search text. */
export function useAdminOrders(filters: AdminOrderFilters) {
  return useQuery({
    queryKey: ['orders', 'admin', filters],
    queryFn: () => fetchAdminOrders(filters),
    placeholderData: keepPreviousData,
  })
}

/** Staff: change an order's status. Cancelling returns stock, so products are refreshed too. */
export function useSetOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => setOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
}

/** Cancel a pending order. The stock goes back, so product data is reloaded too. */
export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
}

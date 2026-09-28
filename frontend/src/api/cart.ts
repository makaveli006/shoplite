import { api } from '@/lib/api'
import type { Cart } from '@/types/api'

// Every cart endpoint answers with the complete, updated cart (see backend cart/views.py).

export async function fetchCart(): Promise<Cart> {
  const { data } = await api.get<Cart>('/cart/')
  return data
}

export async function addToCart(productId: number, quantity: number): Promise<Cart> {
  const { data } = await api.post<Cart>('/cart/items/', { product_id: productId, quantity })
  return data
}

export async function updateCartItem(itemId: number, quantity: number): Promise<Cart> {
  const { data } = await api.patch<Cart>(`/cart/items/${itemId}/`, { quantity })
  return data
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/cart/items/${itemId}/`)
  return data
}

export async function clearCart(): Promise<Cart> {
  const { data } = await api.delete<Cart>('/cart/')
  return data
}

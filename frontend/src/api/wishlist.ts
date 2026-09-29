import { api } from '@/lib/api'
import type { WishlistItem } from '@/types/api'

/** My saved products, newest first (all of them: a wishlist has no pages). */
export async function fetchWishlist(): Promise<WishlistItem[]> {
  const { data } = await api.get<WishlistItem[]>('/wishlist/')
  return data
}

/** Save a product. Saving one that is already saved is fine (the API answers 200 instead of 201). */
export async function addToWishlist(productId: number): Promise<WishlistItem> {
  const { data } = await api.post<WishlistItem>('/wishlist/', { product_id: productId })
  return data
}

/** Take a product off my wishlist (by product id; fine if it wasn't saved). */
export async function removeFromWishlist(productId: number): Promise<void> {
  await api.delete(`/wishlist/${productId}/`)
}

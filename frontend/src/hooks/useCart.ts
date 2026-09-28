import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { addToCart, clearCart, fetchCart, removeCartItem, updateCartItem } from '@/api/cart'
import { useAuth } from '@/auth/useAuth'
import type { Cart } from '@/types/api'

export const CART_KEY = ['cart']

/** The signed-in customer's cart (nothing is loaded for visitors). */
export function useCart() {
  const { status } = useAuth()
  return useQuery({
    queryKey: CART_KEY,
    queryFn: fetchCart,
    enabled: status === 'authenticated',
  })
}

/**
 * Shared behaviour of every cart change: the server answers with the whole updated cart,
 * so we simply store that answer as the new cart. No extra request needed.
 */
function useCartMutation<TVariables>(change: (variables: TVariables) => Promise<Cart>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: change,
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  })
}

export function useAddToCart() {
  return useCartMutation(({ productId, quantity }: { productId: number; quantity: number }) =>
    addToCart(productId, quantity),
  )
}

export function useUpdateCartItem() {
  return useCartMutation(({ itemId, quantity }: { itemId: number; quantity: number }) =>
    updateCartItem(itemId, quantity),
  )
}

export function useRemoveCartItem() {
  return useCartMutation((itemId: number) => removeCartItem(itemId))
}

export function useClearCart() {
  return useCartMutation(() => clearCart())
}

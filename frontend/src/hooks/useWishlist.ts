import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/api/wishlist'
import { useAuth } from '@/auth/useAuth'
import { getErrorMessage } from '@/lib/api'
import type { WishlistItem, WishlistProduct } from '@/types/api'

export const WISHLIST_KEY = ['wishlist']

/** My wishlist. Only requested when signed in (logout clears it together with the rest of the cache). */
export function useWishlist() {
  const { status } = useAuth()
  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: fetchWishlist,
    enabled: status === 'authenticated',
  })
}

/** Is this product saved? Every heart on the page reads the same cached list: no extra requests. */
export function useIsInWishlist(productId: number) {
  const wishlist = useWishlist()
  return wishlist.data?.some((item) => item.product.id === productId) ?? false
}

interface Toggle {
  product: WishlistProduct
  saved: boolean // is it saved right now? true: remove it, false: save it
}

/**
 * Save or remove a product, with an "optimistic update": the wishlist in the cache (and so
 * every heart and the header count) changes immediately, before the server has answered.
 * If the server refuses, the old list is put back.
 */
export function useToggleWishlist() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ product, saved }: Toggle) => {
      if (saved) await removeFromWishlist(product.id)
      else await addToWishlist(product.id)
    },

    onMutate: async ({ product, saved }) => {
      // Stop a wishlist request that is still running, so its (older) answer can't overwrite our change.
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY })
      const previous = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEY)
      queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEY, (items = []) =>
        saved
          ? items.filter((item) => item.product.id !== product.id)
          : // A stand-in item until the server's real one arrives (see onSettled).
            [{ id: -product.id, product, added_at: new Date().toISOString() }, ...items],
      )
      return { previous }
    },

    onError: (error, _toggle, context) => {
      queryClient.setQueryData(WISHLIST_KEY, context?.previous) // undo the early change
      toast.error(getErrorMessage(error))
    },

    // The messages live here (not in the component) because removing an item on the
    // wishlist page removes its row, and a removed component would never show them.
    onSuccess: (_result, { product, saved }) => {
      if (saved) {
        toast(`${product.name} was removed from your wishlist.`)
      } else {
        toast.success(`${product.name} was saved to your wishlist.`, {
          action: { label: 'View wishlist', onClick: () => navigate('/wishlist') },
        })
      }
    },

    // Success or not: fetch the real list, so the cache matches the server again.
    onSettled: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  })
}

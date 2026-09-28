import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteProduct, saveProduct, setProductVisibility, type ProductFormValues } from '@/api/adminCatalog'

import { CART_KEY } from './useCart'

/** After any product change, everything that shows products is reloaded when next needed. */
function useInvalidateProducts() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    queryClient.invalidateQueries({ queryKey: ['product'] })
    queryClient.invalidateQueries({ queryKey: CART_KEY }) // carts show product details too
    queryClient.invalidateQueries({ queryKey: ['categories'] }) // their product counts change
  }
}

export function useSaveProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (input: { existingSlug: string | null; values: ProductFormValues; image: File | null; removeImage: boolean }) =>
      saveProduct(input.existingSlug, input.values, input.image, input.removeImage),
    onSuccess: invalidate,
  })
}

export function useSetProductVisibility() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: ({ slug, isActive }: { slug: string; isActive: boolean }) => setProductVisibility(slug, isActive),
    onSuccess: invalidate,
  })
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (slug: string) => deleteProduct(slug),
    onSuccess: invalidate,
  })
}

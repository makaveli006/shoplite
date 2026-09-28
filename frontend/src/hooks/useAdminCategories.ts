import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteCategory, saveCategory, type CategoryFormValues } from '@/api/adminCatalog'

/** Category changes affect the category list and every product that shows a category name. */
function useInvalidateCategories() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    queryClient.invalidateQueries({ queryKey: ['products'] })
    queryClient.invalidateQueries({ queryKey: ['product'] })
  }
}

export function useSaveCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: ({ existingSlug, values }: { existingSlug: string | null; values: CategoryFormValues }) =>
      saveCategory(existingSlug, values),
    onSuccess: invalidate,
  })
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: (slug: string) => deleteCategory(slug),
    onSuccess: invalidate,
  })
}

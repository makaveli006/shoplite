import { keepPreviousData, queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchCategories, fetchProduct, fetchProducts, type ProductFilters } from '@/api/catalog'

/** A page of products for the given filters. Each combination of filters is remembered separately. */
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    // While the next page / filter result loads, keep showing the previous one (no flashing).
    placeholderData: keepPreviousData,
  })
}

/** How to load one product. Shared by useProduct and by prefetching on hover. */
export function productQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
  })
}

/** One product by its slug. */
export function useProduct(slug: string) {
  return useQuery(productQueryOptions(slug))
}

/** Start loading a product's details early (e.g. when the mouse moves over its card). */
export function usePrefetchProduct() {
  const queryClient = useQueryClient()
  return (slug: string) => queryClient.prefetchQuery(productQueryOptions(slug))
}

/** All categories. They rarely change, so reuse them for 5 minutes before asking again. */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  })
}

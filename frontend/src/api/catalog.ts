import { api } from '@/lib/api'
import type { Category, Product, ProductPage, ProductSuggestion } from '@/types/api'

/** The query parameters /api/products/ understands (see catalog/filters.py and views.py). */
export interface ProductFilters {
  search?: string
  category?: string
  min_price?: string
  max_price?: string
  ordering?: string
  page?: number
}

export const PRODUCTS_PAGE_SIZE = 12 // must match StandardPagination.page_size in the backend

export async function fetchProducts(filters: ProductFilters): Promise<ProductPage> {
  // Leave out empty filters: "?category=" would mean "category with an empty name".
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
  )
  const { data } = await api.get<ProductPage>('/products/', { params })
  return data
}

/** Up to 6 product names for the search box's dropdown (typo-tolerant). */
export async function fetchProductSuggestions(q: string): Promise<ProductSuggestion[]> {
  const { data } = await api.get<ProductSuggestion[]>('/products/suggest/', { params: { q } })
  return data
}

export async function fetchProduct(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${slug}/`)
  return data
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories/')
  return data
}

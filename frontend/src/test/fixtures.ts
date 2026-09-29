import type { Category, Paginated, Product } from '@/types/api'

/** A realistic product, with any fields replaced as needed: makeProduct({ stock: 0 }) */
export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 7,
    name: 'Chef Knife',
    slug: 'chef-knife',
    description: 'A 20 cm stainless steel chef knife.',
    price: '49.99',
    stock: 5,
    in_stock: true,
    image: null,
    is_active: true,
    category: { id: 2, name: 'Kitchen', slug: 'kitchen' },
    average_rating: null,
    review_count: 0,
    created_at: '2026-09-27T15:19:22Z',
    updated_at: '2026-09-27T15:19:22Z',
    ...overrides,
  }
}

export function page<T>(results: T[], count = results.length): Paginated<T> {
  return { count, next: null, previous: null, results }
}

export const categories: Category[] = [
  { id: 2, name: 'Kitchen', slug: 'kitchen', description: '', product_count: 2 },
  { id: 7, name: 'Books', slug: 'books', description: '', product_count: 1 },
]

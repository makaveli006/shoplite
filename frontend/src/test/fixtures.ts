import type { AuthContextValue } from '@/auth/context'
import type {
  Category,
  Order,
  Paginated,
  Product,
  ProductSuggestion,
  User,
  WishlistItem,
  WishlistProduct,
} from '@/types/api'

/** A product in the search box's dropdown: makeSuggestion({ name: 'Bluetooth Speaker' }) */
export function makeSuggestion(overrides: Partial<ProductSuggestion> = {}): ProductSuggestion {
  return {
    id: 21,
    name: 'Noise-Cancelling Headphones',
    slug: 'noise-cancelling-headphones',
    price: '99.00',
    image: null,
    category: { id: 4, name: 'Electronics', slug: 'electronics' },
    ...overrides,
  }
}

/** Ana's pending order #15: one Chef Knife. makeOrder({ status: 'paid', status_display: 'Paid' }) */
export function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 15,
    status: 'pending',
    status_display: 'Pending',
    total_amount: '49.99',
    items: [
      {
        id: 1,
        product: 7,
        product_slug: 'chef-knife',
        product_name: 'Chef Knife',
        unit_price: '49.99',
        quantity: 1,
        line_total: '49.99',
      },
    ],
    customer_email: 'ana@example.com',
    full_name: 'Ana Silva',
    address: '1 Tea Street',
    city: 'Kochi',
    postal_code: '682001',
    country: 'India',
    phone: '9876543210',
    created_at: '2026-09-29T09:00:00Z',
    updated_at: '2026-09-29T09:00:00Z',
    ...overrides,
  }
}

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 3,
    email: 'ana@example.com',
    username: 'ana',
    first_name: 'Ana',
    last_name: 'Silva',
    is_staff: false,
    date_joined: '2026-09-01T10:00:00Z',
    ...overrides,
  }
}

/** For renderWithProviders(ui, { auth: signedIn() }): a signed-in customer. */
export function signedIn(user: User = makeUser()): Partial<AuthContextValue> {
  return { user, status: 'authenticated' }
}

/** A saved product: makeWishlistItem({ product: { is_active: false } }) */
export function makeWishlistItem({
  product,
  ...overrides
}: Partial<Omit<WishlistItem, 'product'>> & { product?: Partial<WishlistProduct> } = {}): WishlistItem {
  return {
    id: 1,
    added_at: '2026-09-28T09:00:00Z',
    product: {
      id: 7,
      name: 'Chef Knife',
      slug: 'chef-knife',
      price: '49.99',
      stock: 5,
      in_stock: true,
      image: null,
      is_active: true,
      ...product,
    },
    ...overrides,
  }
}

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
    search_snippet: null,
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

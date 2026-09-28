// The shapes of the JSON our Django API returns (see the serializers in the backend).

/** Every paginated list endpoint (e.g. /api/products/) wraps its results like this. */
export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/** The logged-in user, from GET /api/auth/me/ */
export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  is_staff: boolean
  date_joined: string
}

/** What POST /api/auth/token/ returns after a successful login. */
export interface TokenPair {
  access: string
  refresh: string
}

export interface CategorySummary {
  id: number
  name: string
  slug: string
}

export interface Category extends CategorySummary {
  description: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string // money arrives as text, e.g. "12.50", to keep it exact
  stock: number
  in_stock: boolean
  image: string | null
  is_active: boolean
  category: CategorySummary
  created_at: string
  updated_at: string
}

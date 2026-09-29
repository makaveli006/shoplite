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
  product_count: number // products using this category, hidden ones included
}

/** The product details shown on a cart line. */
export interface CartProduct {
  id: number
  name: string
  slug: string
  price: string
  stock: number
  image: string | null
  is_active: boolean
}

export interface CartItem {
  id: number
  product: CartProduct
  quantity: number
  line_total: string
  issue: string | null // e.g. "Only 2 left in stock." or null when the line is fine
  added_at: string
}

/** GET /api/cart/ (and every cart change) returns the whole cart. */
export interface Cart {
  id: number
  items: CartItem[]
  item_count: number
  total: string
  has_issues: boolean
  updated_at: string
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

/** One line of an order: name and price are copies from the moment of purchase. */
export interface OrderItem {
  id: number
  product: number | null // null if the product was deleted later
  product_slug: string | null
  product_name: string
  unit_price: string
  quantity: number
  line_total: string
}

export interface ShippingAddress {
  full_name: string
  address: string
  city: string
  postal_code: string
  country: string
  phone: string
}

export interface Order extends ShippingAddress {
  id: number
  status: OrderStatus
  status_display: string
  total_amount: string
  items: OrderItem[]
  customer_email: string
  created_at: string
  updated_at: string
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
  average_rating: number | null // e.g. 4.3; null while the product has no reviews
  review_count: number
  // While searching: the description with matched words between \u0002 and \u0003 (see HighlightedText).
  search_snippet: string | null
  created_at: string
  updated_at: string
}

/** A page of products; while searching it can also suggest a spelling ("headphones"). */
export type ProductPage = Paginated<Product> & { did_you_mean?: string | null }

/** GET /products/suggest/?q=: a small product for the search box's dropdown. */
export interface ProductSuggestion {
  id: number
  name: string
  slug: string
  price: string
  image: string | null
  category: CategorySummary
}

/** POST /payments/start/: everything the Razorpay payment window needs for one order. */
export interface PaymentStart {
  key_id: string // public key id (rzp_test_... in test mode)
  razorpay_order_id: string
  amount: number // in paise: ₹49.99 = 4999
  currency: string
  name: string
  description: string
  prefill: { name: string; email: string; contact: string }
  test_mode: boolean
}

/** The product details a wishlist item carries (a smaller version of Product). */
export interface WishlistProduct {
  id: number
  name: string
  slug: string
  price: string
  stock: number
  in_stock: boolean
  image: string | null
  is_active: boolean // false: hidden by the shop since it was saved ("no longer available")
}

export interface WishlistItem {
  id: number
  product: WishlistProduct
  added_at: string
}

export interface Review {
  id: number
  rating: number // 1 to 5 stars
  comment: string // may be empty
  author: string // a public name like "Ana S.", never the email
  is_visible: boolean // false when staff hid it (the author still sees their own)
  created_at: string
  updated_at: string
}

/** GET /products/<slug>/reviews/me/ : may I review this product, and my review if I wrote one. */
export interface MyReview {
  can_review: boolean
  review: Review | null
}

export interface ReviewValues {
  rating: number
  comment: string
}

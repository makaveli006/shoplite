const priceFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: import.meta.env.VITE_CURRENCY || 'USD',
})

/** "12.50" -> "$12.50" (or "₹12.50", "€12.50", ... depending on VITE_CURRENCY and the browser's language). */
export function formatPrice(price: string | number): string {
  return priceFormatter.format(Number(price))
}

/** 4 -> "4.0", 4.3 -> "4.3" (average star ratings). */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** 1 -> "1 review", 12 -> "12 reviews" */
export function formatReviewCount(count: number): string {
  return `${count} ${count === 1 ? 'review' : 'reviews'}`
}

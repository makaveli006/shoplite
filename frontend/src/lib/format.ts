const priceFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: import.meta.env.VITE_CURRENCY || 'USD',
})

/** "12.50" -> "$12.50" (or "₹12.50", "€12.50", ... depending on VITE_CURRENCY and the browser's language). */
export function formatPrice(price: string | number): string {
  return priceFormatter.format(Number(price))
}

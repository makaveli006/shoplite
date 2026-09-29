import { useEffect } from 'react'
import { useLocation } from 'react-router'

import type { Product } from '@/types/api'

import { MyReviewBox } from './MyReviewBox'
import { RatingSummary } from './RatingSummary'
import { ReviewList } from './ReviewList'

/**
 * The "Customer reviews" section of a product page. The page loads this file only when it
 * is shown (React.lazy), which keeps the first download of the shop small.
 */
export function ProductReviews({ product }: { product: Product }) {
  const location = useLocation()

  // Opened with "#reviews" in the address (e.g. "Write a review" on an order, or back from
  // signing in): scroll down to this section. React Router doesn't do this by itself.
  useEffect(() => {
    if (location.hash === '#reviews') {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    // scroll-mt: leave room for the sticky header when scrolling to #reviews.
    <section id="reviews" aria-labelledby="reviews-heading" className="flex scroll-mt-24 flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight">
          Customer reviews
        </h2>
        <span className="text-sm">
          <RatingSummary product={product} />
        </span>
      </div>
      <MyReviewBox product={product} />
      <ReviewList slug={product.slug} />
    </section>
  )
}

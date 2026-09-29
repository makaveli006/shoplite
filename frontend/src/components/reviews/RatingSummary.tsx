import { formatRating, formatReviewCount } from '@/lib/format'
import type { Product } from '@/types/api'

import { StarRating } from './StarRating'

/** "★★★★☆ 4.3 (12 reviews)", or "No reviews yet". */
export function RatingSummary({ product }: { product: Product }) {
  if (!product.review_count || product.average_rating === null) {
    return <span className="text-muted-foreground">No reviews yet</span>
  }
  return (
    <span className="inline-flex items-center gap-2">
      <StarRating rating={product.average_rating} />
      <span className="font-medium">{formatRating(product.average_rating)}</span>
      <span className="text-muted-foreground">({formatReviewCount(product.review_count)})</span>
    </span>
  )
}

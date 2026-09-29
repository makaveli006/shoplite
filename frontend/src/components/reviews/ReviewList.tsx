import { BadgeCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useReviews } from '@/hooks/useReviews'
import { getErrorMessage } from '@/lib/api'
import type { Review } from '@/types/api'

import { StarRating } from './StarRating'

/** All customers' reviews of a product, newest first, 5 at a time. */
export function ReviewList({ slug }: { slug: string }) {
  const reviews = useReviews(slug)

  if (reviews.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (reviews.isError) {
    return <p className="text-sm text-destructive">Couldn't load the reviews. {getErrorMessage(reviews.error)}</p>
  }

  // An infinite query keeps every page loaded so far: put their reviews in one list.
  const items = reviews.data.pages.flatMap((page) => page.results)
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y">
        {items.map((review) => (
          <li key={review.id} className="py-4 first:pt-0">
            <ReviewItem review={review} />
          </li>
        ))}
      </ul>
      {reviews.hasNextPage && (
        <Button
          variant="outline"
          className="self-start"
          onClick={() => reviews.fetchNextPage()}
          disabled={reviews.isFetchingNextPage}
        >
          {reviews.isFetchingNextPage ? 'Loading...' : 'Show more reviews'}
        </Button>
      )}
    </div>
  )
}

/** One review: stars, name, "Verified purchase", date and comment. */
export function ReviewItem({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
  return (
    <article className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm font-medium">{review.author}</span>
        {/* Only customers with a delivered order can review, so every review is a verified purchase. */}
        <Badge variant="secondary">
          <BadgeCheck aria-hidden /> Verified purchase
        </Badge>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      {review.comment && <p className="text-sm leading-relaxed whitespace-pre-line">{review.comment}</p>}
    </article>
  )
}

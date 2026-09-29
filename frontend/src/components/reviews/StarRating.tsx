import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

const SIZES = { sm: 'size-3.5', md: 'size-5' }

interface Props {
  rating: number
  size?: keyof typeof SIZES
  className?: string
}

/** Stars for showing a rating (not clickable). 4.3 fills 4 stars: rounded to the nearest whole star. */
export function StarRating({ rating, size = 'md', className }: Props) {
  const filled = Math.round(rating)
  return (
    // Screen readers read the label instead of five separate star pictures.
    <span role="img" aria-label={`Rated ${rating} out of 5`} className={cn('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          data-filled={star <= filled}
          className={cn(SIZES[size], star <= filled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')}
        />
      ))}
    </span>
  )
}

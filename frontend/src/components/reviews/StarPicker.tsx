import { Star } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface Props {
  value: number // 0 = nothing chosen yet
  onChange: (rating: number) => void
  labelledBy?: string
  invalid?: boolean
}

/** Five clickable stars for choosing a rating. Hovering shows what a click would choose. */
export function StarPicker({ value, onChange, labelledBy, invalid }: Props) {
  const [hovered, setHovered] = useState(0)
  const shown = hovered || value

  return (
    // radiogroup / radio: screen readers announce "4 stars, selected", like a set of radio buttons.
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-invalid={invalid || undefined}
      className="flex gap-1"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={star === 1 ? '1 star' : `${star} stars`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="rounded-md p-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Star
            aria-hidden
            className={cn('size-7 transition-colors', star <= shown ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')}
          />
        </button>
      ))}
    </div>
  )
}

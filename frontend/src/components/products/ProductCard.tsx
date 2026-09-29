import { ImageOff } from 'lucide-react'
import { Link } from 'react-router'

import { StarRating } from '@/components/reviews/StarRating'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePrefetchProduct } from '@/hooks/useCatalog'
import { formatPrice, formatRating } from '@/lib/format'
import type { Product } from '@/types/api'

export function ProductCard({ product }: { product: Product }) {
  const prefetch = usePrefetchProduct()

  return (
    <Link
      to={`/products/${product.slug}`}
      // Start loading the product page as soon as the mouse (or keyboard focus) arrives on the card.
      onMouseEnter={() => prefetch(product.slug)}
      onFocus={() => prefetch(product.slug)}
      className="group rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="h-full pt-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-10" aria-hidden />
            </div>
          )}
          {!product.in_stock && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Out of stock
            </Badge>
          )}
        </div>
        <CardHeader>
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
          {product.review_count > 0 && product.average_rating !== null && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <StarRating rating={product.average_rating} size="sm" />
              <span>
                {formatRating(product.average_rating)} ({product.review_count})
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

/** Grey placeholder in the shape of a product card, shown while products load. */
export function ProductCardSkeleton() {
  return (
    <Card className="pt-0">
      <Skeleton className="aspect-square rounded-none" />
      <CardHeader>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-1/4" />
      </CardContent>
    </Card>
  )
}

import { AlertCircle, Heart, ImageOff, ShoppingCart, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAddToCart } from '@/hooks/useCart'
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist'
import { getErrorMessage, getFirstErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import type { WishlistItem, WishlistProduct } from '@/types/api'

export function WishlistPage() {
  const wishlist = useWishlist()

  if (wishlist.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (wishlist.isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <AlertCircle className="size-8 text-destructive" />
        <p className="font-medium">Couldn't load your wishlist.</p>
        <p className="text-sm text-muted-foreground">{getErrorMessage(wishlist.error)}</p>
        <Button variant="outline" onClick={() => wishlist.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const items = wishlist.data

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <title>My wishlist | ShopLite</title>
        <Heart className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Your wishlist is empty</h1>
        <p className="text-muted-foreground">Tap the heart on any product to save it for later.</p>
        <Button asChild>
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <title>My wishlist | ShopLite</title>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My wishlist</h1>
        <p className="text-sm text-muted-foreground">
          {items.length} saved {items.length === 1 ? 'product' : 'products'}
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col">
          {items.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator className="my-4" />}
              <WishlistLine item={item} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function WishlistLine({ item }: { item: WishlistItem }) {
  const { product } = item
  const navigate = useNavigate()
  const addMutation = useAddToCart()
  const toggle = useToggleWishlist()
  const canBuy = product.is_active && product.in_stock

  function addToCart() {
    // One piece; the product stays in the wishlist (it's a list of things you like).
    addMutation.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () =>
          toast.success(`Added ${product.name} to your cart.`, {
            action: { label: 'View cart', onClick: () => navigate('/cart') },
          }),
        onError: (error) => toast.error(getFirstErrorMessage(error)),
      },
    )
  }

  // A product hidden by the shop has no page any more: show its name without a link.
  const picture = (
    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
      {product.image ? (
        <img src={product.image} alt={product.name} className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageOff className="size-6" aria-hidden />
        </div>
      )}
    </div>
  )

  return (
    <div className="flex gap-4">
      {product.is_active ? <Link to={`/products/${product.slug}`}>{picture}</Link> : picture}

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {product.is_active ? (
              <Link to={`/products/${product.slug}`} className="font-medium hover:underline">
                {product.name}
              </Link>
            ) : (
              <span className="font-medium text-muted-foreground">{product.name}</span>
            )}
            <StockState product={product} />
          </div>
          <p className="font-semibold">{formatPrice(product.price)}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button size="sm" onClick={addToCart} disabled={!canBuy || addMutation.isPending}>
            <ShoppingCart /> {addMutation.isPending ? 'Adding...' : 'Add to cart'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggle.mutate({ product, saved: true })}
            disabled={toggle.isPending}
            aria-label={`Remove ${product.name} from your wishlist`}
          >
            <Trash2 /> Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

function StockState({ product }: { product: WishlistProduct }) {
  if (!product.is_active) return <Badge variant="destructive">No longer available</Badge>
  if (!product.in_stock) return <Badge variant="secondary">Out of stock</Badge>
  if (product.stock <= 5) return <Badge variant="secondary">Only {product.stock} left</Badge>
  return <Badge variant="outline">In stock</Badge>
}

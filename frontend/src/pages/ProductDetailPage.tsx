import { isAxiosError } from 'axios'
import { AlertCircle, ChevronRight, ImageOff, PackageX, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/auth/useAuth'
import { QuantityPicker } from '@/components/products/QuantityPicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAddToCart } from '@/hooks/useCart'
import { useProduct } from '@/hooks/useCatalog'
import { getErrorMessage, getFirstErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/api'

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const product = useProduct(slug)

  if (product.isPending) {
    return <ProductDetailSkeleton />
  }

  if (product.isError) {
    const notFound = isAxiosError(product.error) && product.error.response?.status === 404
    return notFound ? <ProductNotFound /> : <ProductLoadError message={getErrorMessage(product.error)} onRetry={() => product.refetch()} />
  }

  // "key": start with quantity 1 again when switching to another product.
  return <ProductDetails key={product.data.id} product={product.data} />
}

function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const addMutation = useAddToCart()

  function addThisToCart() {
    addMutation.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} × ${product.name} to your cart.`, {
            action: { label: 'View cart', onClick: () => navigate('/cart') },
          })
          setQuantity(1)
        },
        // e.g. 'Only 5 of "Chef Knife" in stock. You already have 4 in your cart.'
        onError: (error) => toast.error(getFirstErrorMessage(error)),
      },
    )
  }

  return (
    <article className="flex flex-col gap-6">
      {/* React places this in the browser tab's title. */}
      <title>{`${product.name} | ShopLite`}</title>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="size-4" />
        <Link to={`/products?category=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
          {product.image ? (
            <img src={product.image} alt={product.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-16" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.category.name}</p>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          </div>

          <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>
          <StockBadge stock={product.stock} />

          {product.description && <p className="leading-relaxed text-muted-foreground">{product.description}</p>}

          <Separator />

          {product.in_stock ? (
            <div className="flex flex-wrap items-center gap-3">
              <QuantityPicker value={quantity} max={product.stock} onChange={setQuantity} />
              {/* Adding to the cart needs a logged-in customer. */}
              {user ? (
                <Button size="lg" onClick={addThisToCart} disabled={addMutation.isPending}>
                  <ShoppingCart /> {addMutation.isPending ? 'Adding...' : 'Add to cart'}
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link to={`/login?next=${encodeURIComponent(location.pathname)}`}>Sign in to add to cart</Link>
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">This product is currently out of stock.</p>
          )}
        </div>
      </div>
    </article>
  )
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>
  if (stock <= 5) return <Badge variant="secondary">Only {stock} left</Badge>
  return <Badge variant="outline">In stock</Badge>
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}

function ProductNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
      <title>Product not found | ShopLite</title>
      <PackageX className="size-10 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-muted-foreground">It may have been removed, or the link is wrong.</p>
      <Button asChild>
        <Link to="/products">See all products</Link>
      </Button>
    </div>
  )
}

function ProductLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
      <AlertCircle className="size-8 text-destructive" />
      <p className="font-medium">Couldn't load this product.</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

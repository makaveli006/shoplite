import { Heart } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { useIsInWishlist, useToggleWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'
import type { WishlistProduct } from '@/types/api'

interface Props {
  product: WishlistProduct // a full Product fits too: it has all these fields
  variant?: 'icon' | 'full' // icon: round button on product cards; full: button with text
  className?: string
}

/** The heart: save a product for later, or take it off the wishlist again. */
export function WishlistButton({ product, variant = 'icon', className }: Props) {
  const { status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const saved = useIsInWishlist(product.id)
  const toggle = useToggleWishlist()

  function click() {
    if (status === 'loading') return // still checking a saved login
    if (status === 'anonymous') {
      // The wishlist belongs to an account: sign in first, then come back to this page.
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`)
      return
    }
    toggle.mutate({ product, saved })
  }

  // aria-pressed: screen readers announce it as a toggle button, "pressed" when saved.
  if (variant === 'full') {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-pressed={saved}
        onClick={click}
        disabled={toggle.isPending}
        className={className}
      >
        <Heart aria-hidden className={cn(saved && 'fill-red-500 text-red-500')} />
        {saved ? 'Saved' : 'Save to wishlist'}
      </Button>
    )
  }

  const label = saved ? `Remove ${product.name} from your wishlist` : `Save ${product.name} to your wishlist`
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={click}
      disabled={toggle.isPending}
      className={cn(
        'flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm ring-1 ring-foreground/10 backdrop-blur transition',
        'hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-70',
        className,
      )}
    >
      <Heart aria-hidden className={cn('size-4.5', saved ? 'fill-red-500 text-red-500' : 'text-foreground')} />
    </button>
  )
}

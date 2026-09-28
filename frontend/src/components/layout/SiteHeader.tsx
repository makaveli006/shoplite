import { ShoppingCart } from 'lucide-react'
import { Link, NavLink } from 'react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// NavLink tells us whether its page is the one currently open, so we can highlight it.
function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted',
    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight">
          ShopLite
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/login" className={navLinkClass}>
            Sign in
          </NavLink>
          <Button asChild variant="outline" size="icon" aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

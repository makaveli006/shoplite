import { LogOut, ShoppingCart } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { displayName, useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

// NavLink tells us whether its page is the one currently open, so we can highlight it.
function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted',
    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
  )
}

export function SiteHeader() {
  const { user, status, logout } = useAuth()
  const navigate = useNavigate()
  const cart = useCart()
  const itemCount = cart.data?.item_count ?? 0 // number of pieces, for the badge on the cart icon

  function signOut() {
    logout()
    toast('You are signed out.')
    navigate('/')
  }

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

          {status === 'loading' && <Skeleton className="h-7 w-24" />}

          {status === 'anonymous' && (
            <NavLink to="/login" className={navLinkClass}>
              Sign in
            </NavLink>
          )}

          {user && (
            <>
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
              {user.is_staff && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/account" className={navLinkClass}>
                Hi, {displayName(user)}
              </NavLink>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut /> Sign out
              </Button>
            </>
          )}

          <Button asChild variant="outline" size="icon" className="relative" aria-label={`Cart, ${itemCount} items`}>
            <Link to="/cart">
              <ShoppingCart />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

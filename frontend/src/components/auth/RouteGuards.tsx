import { ShieldAlert } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function CheckingLogin() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

/** Pages inside this guard need a signed-in customer; visitors are sent to Sign in (and back afterwards). */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <CheckingLogin />
  if (status === 'anonymous') {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return <Outlet />
}

/** Pages inside this guard are for staff only. (The API checks this too: this only keeps the screens tidy.) */
export function RequireAdmin() {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <CheckingLogin />
  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }
  if (!user.is_staff) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
        <title>Not allowed | ShopLite</title>
        <ShieldAlert className="size-10 text-destructive" />
        <h1 className="text-2xl font-semibold">Staff only</h1>
        <p className="text-muted-foreground">This part of the shop is only for administrators.</p>
        <Button asChild>
          <Link to="/">Go to the home page</Link>
        </Button>
      </div>
    )
  }
  return <Outlet />
}

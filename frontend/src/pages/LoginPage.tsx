import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { displayName, useAuth } from '@/auth/useAuth'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import { safeNext } from '@/lib/redirect'

export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = safeNext(searchParams.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (user) => {
      toast.success(`Welcome back, ${displayName(user)}!`)
      navigate(next, { replace: true }) // "replace": Back won't return to the login form
    },
  })

  // Already logged in? No need for this page.
  if (status === 'authenticated' && !loginMutation.isPending) {
    return <Navigate to={next} replace />
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    loginMutation.mutate()
  }

  const error = loginMutation.error
  const fieldErrors = getFieldErrors(error)
  const wrongCredentials = isAxiosError(error) && error.response?.status === 401

  return (
    <div className="mx-auto w-full max-w-sm">
      <title>Sign in | ShopLite</title>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Welcome back! Sign in with your email and password.</CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="flex flex-col gap-4">
            {error && !Object.keys(fieldErrors).length && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {wrongCredentials ? 'Wrong email or password.' : getErrorMessage(error)}
              </p>
            )}
            <FormField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              errors={fieldErrors.email}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              errors={fieldErrors.password}
            />
            <Link to="/forgot-password" className="-mt-2 self-end text-sm text-muted-foreground underline underline-offset-4">
              Forgot your password?
            </Link>
          </CardContent>
          <CardFooter className="mt-4 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-sm text-muted-foreground">
              No account yet?{' '}
              <Link to={`/register?next=${encodeURIComponent(next)}`} className="text-foreground underline underline-offset-4">
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

import { useMutation } from '@tanstack/react-query'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { displayName, useAuth } from '@/auth/useAuth'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import { safeNext } from '@/lib/redirect'

const EMPTY_FORM = { first_name: '', last_name: '', username: '', email: '', password: '' }

export function RegisterPage() {
  const { status, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = safeNext(searchParams.get('next'))

  const [form, setForm] = useState(EMPTY_FORM)

  const registerMutation = useMutation({
    mutationFn: () => register(form),
    onSuccess: (user) => {
      toast.success(`Welcome to ShopLite, ${displayName(user)}!`)
      navigate(next, { replace: true })
    },
  })

  if (status === 'authenticated' && !registerMutation.isPending) {
    return <Navigate to={next} replace />
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    registerMutation.mutate()
  }

  // Update one field of the form, keeping the others.
  function field(name: keyof typeof EMPTY_FORM) {
    return {
      value: form[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: event.target.value }),
    }
  }

  const error = registerMutation.error
  const fieldErrors = getFieldErrors(error)

  return (
    <div className="mx-auto w-full max-w-md">
      <title>Create an account | ShopLite</title>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>It takes less than a minute.</CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="flex flex-col gap-4">
            {error && !Object.keys(fieldErrors).length && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getErrorMessage(error)}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="first_name" label="First name" autoComplete="given-name" {...field('first_name')} errors={fieldErrors.first_name} />
              <FormField id="last_name" label="Last name" autoComplete="family-name" {...field('last_name')} errors={fieldErrors.last_name} />
            </div>
            <FormField id="username" label="Username" autoComplete="username" required {...field('username')} errors={fieldErrors.username} />
            <FormField id="email" label="Email" type="email" autoComplete="email" required {...field('email')} errors={fieldErrors.email} />
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              {...field('password')}
              errors={fieldErrors.password}
            />
            <p className="-mt-2 text-xs text-muted-foreground">At least 8 characters, not too common, not only numbers.</p>
          </CardContent>
          <CardFooter className="mt-4 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creating your account...' : 'Create account'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already registered?{' '}
              <Link to={`/login?next=${encodeURIComponent(next)}`} className="text-foreground underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

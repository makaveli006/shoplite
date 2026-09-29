import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { requestPasswordReset } from '@/api/auth'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage, getFieldErrors } from '@/lib/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const resetMutation = useMutation({ mutationFn: () => requestPasswordReset(email) })

  function submit(event: FormEvent) {
    event.preventDefault()
    resetMutation.mutate()
  }

  const error = resetMutation.error
  const fieldErrors = getFieldErrors(error)
  const tooMany = isAxiosError(error) && error.response?.status === 429

  return (
    <div className="mx-auto w-full max-w-sm">
      <title>Forgot password | ShopLite</title>
      <Card>
        {resetMutation.isSuccess ? (
          // The same message whether or not the account exists (the server decides; see the backend).
          <CardHeader className="items-center text-center">
            <MailCheck className="mx-auto size-10 text-primary" />
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>{resetMutation.data}</CardDescription>
            <Link to="/login" className="mt-2 text-sm underline underline-offset-4">
              Back to sign in
            </Link>
          </CardHeader>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Forgot your password?</CardTitle>
              <CardDescription>Enter your email and we'll send you a link to choose a new one.</CardDescription>
            </CardHeader>
            <form onSubmit={submit}>
              <CardContent className="flex flex-col gap-4">
                {error && !Object.keys(fieldErrors).length && (
                  <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {tooMany ? 'Too many requests. Please wait a while and try again.' : getErrorMessage(error)}
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
              </CardContent>
              <CardFooter className="mt-4 flex-col gap-3">
                <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? 'Sending...' : 'Send reset link'}
                </Button>
                <Link to="/login" className="text-sm text-muted-foreground underline underline-offset-4">
                  Back to sign in
                </Link>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}

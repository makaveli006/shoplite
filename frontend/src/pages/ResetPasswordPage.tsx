import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { confirmPasswordReset } from '@/api/auth'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage, getFieldErrors } from '@/lib/api'

/** Opened from the link in the reset email: /reset-password/<uid>/<token> */
export function ResetPasswordPage() {
  const { uid = '', token = '' } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [mismatch, setMismatch] = useState(false)

  const confirmMutation = useMutation({
    mutationFn: () => confirmPasswordReset(uid, token, password),
    onSuccess: (message) => {
      toast.success(message)
      navigate('/login', { replace: true })
    },
  })

  function submit(event: FormEvent) {
    event.preventDefault()
    // Checked here first, so a typo doesn't use up the one-time link.
    if (password !== repeat) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    confirmMutation.mutate()
  }

  const fieldErrors = getFieldErrors(confirmMutation.error)
  const linkProblem = fieldErrors.token?.[0]
  const otherError = confirmMutation.isError && !Object.keys(fieldErrors).length

  return (
    <div className="mx-auto w-full max-w-sm">
      <title>Choose a new password | ShopLite</title>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Choose a new password</CardTitle>
          <CardDescription>After saving it, sign in with your new password.</CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="flex flex-col gap-4">
            {linkProblem && (
              <div role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <p>{linkProblem}</p>
                <Link to="/forgot-password" className="font-medium underline underline-offset-4">
                  Request a new link
                </Link>
              </div>
            )}
            {otherError && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getErrorMessage(confirmMutation.error)}
              </p>
            )}
            <FormField
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              errors={fieldErrors.new_password}
            />
            <FormField
              id="repeat-password"
              label="Repeat the new password"
              type="password"
              autoComplete="new-password"
              required
              value={repeat}
              onChange={(event) => setRepeat(event.target.value)}
              errors={mismatch ? ['The two passwords are not the same.'] : undefined}
            />
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={confirmMutation.isPending}>
              {confirmMutation.isPending ? 'Saving...' : 'Save new password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

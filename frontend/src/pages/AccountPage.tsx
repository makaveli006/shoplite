import { useMutation } from '@tanstack/react-query'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'sonner'

import { updateMe, type ProfileData } from '@/api/auth'
import { useAuth } from '@/auth/useAuth'
import { FormField } from '@/components/FormField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import type { User } from '@/types/api'

export function AccountPage() {
  const { user } = useAuth()
  // RequireAuth guarantees a user here; "key" refills the form if the user changes.
  return user ? <AccountForm key={user.id} user={user} /> : null
}

function AccountForm({ user }: { user: User }) {
  const { updateUser } = useAuth()
  const [form, setForm] = useState<ProfileData>({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
  })

  const saveMutation = useMutation({
    mutationFn: () => updateMe(form),
    onSuccess: (updated) => {
      updateUser(updated) // the header greeting updates immediately
      toast.success('Your details were saved.')
    },
  })

  function field(name: keyof ProfileData) {
    return {
      value: form[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: event.target.value }),
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    saveMutation.mutate()
  }

  const fieldErrors = getFieldErrors(saveMutation.error)
  const memberSince = new Date(user.date_joined).toLocaleDateString(undefined, { dateStyle: 'long' })

  return (
    <div className="mx-auto w-full max-w-lg">
      <title>My account | ShopLite</title>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            My account {user.is_staff && <Badge>Administrator</Badge>}
          </CardTitle>
          <CardDescription>
            {user.email} · member since {memberSince}
          </CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="flex flex-col gap-4">
            {saveMutation.isError && !Object.keys(fieldErrors).length && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getErrorMessage(saveMutation.error)}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="first_name" label="First name" {...field('first_name')} errors={fieldErrors.first_name} />
              <FormField id="last_name" label="Last name" {...field('last_name')} errors={fieldErrors.last_name} />
            </div>
            <FormField id="username" label="Username" required {...field('username')} errors={fieldErrors.username} />
            <p className="text-xs text-muted-foreground">Your email address is your login and can't be changed here.</p>
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

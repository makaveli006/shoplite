import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props extends ComponentProps<typeof Input> {
  id: string
  label: string
  errors?: string[]
}

/** A labelled text box with the server's error messages for it underneath. */
export function FormField({ id, label, errors, ...inputProps }: Props) {
  const hasErrors = Boolean(errors?.length)
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={hasErrors} aria-describedby={hasErrors ? `${id}-errors` : undefined} {...inputProps} />
      {hasErrors && (
        <ul id={`${id}-errors`} className="text-sm text-destructive">
          {errors!.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

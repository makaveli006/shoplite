import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import type { ReviewValues } from '@/types/api'

import { StarPicker } from './StarPicker'

const MAX_COMMENT = 2000 // same limit as the backend

interface Props {
  initial?: ReviewValues // given when editing an existing review
  submitLabel: string
  pending: boolean
  error: unknown // the mutation's error, if the last save failed
  onSubmit: (values: ReviewValues) => void
  onCancel?: () => void
}

/** Stars + optional comment. Used both for writing a new review and for editing one. */
export function ReviewForm({ initial, submitLabel, pending, error, onSubmit, onCancel }: Props) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [comment, setComment] = useState(initial?.comment ?? '')
  const [missingRating, setMissingRating] = useState(false)

  const fieldErrors = getFieldErrors(error)
  const generalError = error && !Object.keys(fieldErrors).length ? getErrorMessage(error) : null
  // Checked here first, so the customer doesn't wait for the server to say "rating is required".
  const ratingErrors = missingRating ? ['Choose a rating from 1 to 5 stars.'] : fieldErrors.rating

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!rating) {
      setMissingRating(true)
      return
    }
    onSubmit({ rating, comment })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {generalError && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {generalError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <span id="review-rating-label" className="text-sm font-medium">
          Your rating
        </span>
        <StarPicker
          value={rating}
          onChange={(value) => {
            setRating(value)
            setMissingRating(false)
          }}
          labelledBy="review-rating-label"
          invalid={Boolean(ratingErrors)}
        />
        <Errors messages={ratingErrors} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-comment">
          Your review <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="review-comment"
          rows={4}
          maxLength={MAX_COMMENT}
          placeholder="What did you like or dislike? How do you use it?"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          aria-invalid={Boolean(fieldErrors.comment)}
        />
        <p className="self-end text-xs text-muted-foreground">
          {comment.length} / {MAX_COMMENT}
        </p>
        <Errors messages={fieldErrors.comment} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

function Errors({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <ul className="text-sm text-destructive">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  )
}

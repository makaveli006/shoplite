import { EyeOff, Pencil, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/auth/useAuth'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateReview, useDeleteReview, useMyReview, useUpdateReview } from '@/hooks/useReviews'
import { getErrorMessage } from '@/lib/api'
import type { Product, ReviewValues } from '@/types/api'

import { ReviewForm } from './ReviewForm'
import { ReviewItem } from './ReviewList'

/**
 * The signed-in customer's own part of the reviews section. Depending on the situation:
 * sign in first / write a review / your review (edit, delete) / not delivered to you yet.
 */
export function MyReviewBox({ product }: { product: Product }) {
  const { status } = useAuth()
  const location = useLocation()
  const myReview = useMyReview(product.slug, status === 'authenticated')
  const createMutation = useCreateReview(product.slug)
  const updateMutation = useUpdateReview(product.slug)
  const deleteMutation = useDeleteReview(product.slug)
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (status === 'loading') return null

  if (status === 'anonymous') {
    const next = encodeURIComponent(`${location.pathname}#reviews`) // come back to this section after login
    return (
      <Box>
        <p className="text-sm text-muted-foreground">
          Bought this product?{' '}
          <Link to={`/login?next=${next}`} className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>{' '}
          to write a review.
        </p>
      </Box>
    )
  }

  if (myReview.isPending) return <Skeleton className="h-28 w-full rounded-xl" />
  if (myReview.isError) {
    return (
      <Box>
        <p className="text-sm text-destructive">{getErrorMessage(myReview.error)}</p>
      </Box>
    )
  }

  const { can_review, review } = myReview.data

  if (review && editing) {
    return (
      <Box title="Edit your review">
        <ReviewForm
          initial={{ rating: review.rating, comment: review.comment }}
          submitLabel="Save changes"
          pending={updateMutation.isPending}
          error={updateMutation.error}
          onSubmit={(values: ReviewValues) =>
            updateMutation.mutate(values, {
              onSuccess: () => {
                toast.success('Your review was updated.')
                setEditing(false)
              },
            })
          }
          onCancel={() => {
            updateMutation.reset() // forget any error from a failed save
            setEditing(false)
          }}
        />
      </Box>
    )
  }

  if (review) {
    return (
      <Box title="Your review">
        {!review.is_visible && (
          <p className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <EyeOff className="size-4 shrink-0" aria-hidden />
            The shop has hidden this review, so other customers can't see it.
          </p>
        )}
        <ReviewItem review={review} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfirmingDelete(true)}>
            <Trash2 /> Delete
          </Button>
        </div>
        <ConfirmDialog
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          title="Delete your review?"
          description="Your stars and comment will be removed from this product. You can write a new review later."
          confirmLabel="Delete review"
          pending={deleteMutation.isPending}
          onConfirm={() =>
            deleteMutation.mutate(undefined, {
              onSuccess: () => toast.success('Your review was deleted.'),
              onError: (error) => toast.error(getErrorMessage(error)),
              onSettled: () => setConfirmingDelete(false),
            })
          }
        />
      </Box>
    )
  }

  if (can_review) {
    return (
      <Box title="Write a review">
        <ReviewForm
          submitLabel="Post review"
          pending={createMutation.isPending}
          error={createMutation.error}
          onSubmit={(values) =>
            createMutation.mutate(values, { onSuccess: () => toast.success('Thank you! Your review is posted.') })
          }
        />
      </Box>
    )
  }

  return (
    <Box>
      <p className="text-sm text-muted-foreground">
        You can review this product once an order with it has been delivered to you.
      </p>
    </Box>
  )
}

function Box({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      {title && <h3 className="font-semibold">{title}</h3>}
      {children}
    </div>
  )
}

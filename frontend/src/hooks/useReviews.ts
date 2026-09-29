import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createReview, deleteReview, fetchMyReview, fetchReviews, updateReview } from '@/api/reviews'
import type { MyReview, Review, ReviewValues } from '@/types/api'

/** A product's reviews, loaded 5 at a time: each "Show more" adds the next page to the list. */
export function useReviews(slug: string) {
  return useInfiniteQuery({
    queryKey: ['reviews', slug],
    queryFn: ({ pageParam }) => fetchReviews(slug, pageParam),
    initialPageParam: 1,
    // The API says whether there is a next page; if so, ask for page number + 1.
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined),
  })
}

/** Only for signed-in customers (enabled = false otherwise: nothing is requested). */
export function useMyReview(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: ['my-review', slug],
    queryFn: () => fetchMyReview(slug),
    enabled,
  })
}

/** After writing, changing or deleting a review, the list and the product's average change too. */
function useReviewChanged(slug: string) {
  const queryClient = useQueryClient()
  return (review: Review | null) => {
    queryClient.setQueryData<MyReview>(['my-review', slug], (old) => ({ can_review: old?.can_review ?? true, review }))
    queryClient.invalidateQueries({ queryKey: ['reviews', slug] })
    queryClient.invalidateQueries({ queryKey: ['product', slug] })
    queryClient.invalidateQueries({ queryKey: ['products'] }) // stars on the product cards
  }
}

export function useCreateReview(slug: string) {
  const changed = useReviewChanged(slug)
  return useMutation({
    mutationFn: (values: ReviewValues) => createReview(slug, values),
    onSuccess: changed,
  })
}

export function useUpdateReview(slug: string) {
  const changed = useReviewChanged(slug)
  return useMutation({
    mutationFn: (values: ReviewValues) => updateReview(slug, values),
    onSuccess: changed,
  })
}

export function useDeleteReview(slug: string) {
  const changed = useReviewChanged(slug)
  return useMutation({
    mutationFn: () => deleteReview(slug),
    onSuccess: () => changed(null),
  })
}

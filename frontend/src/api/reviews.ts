import { api } from '@/lib/api'
import type { MyReview, Paginated, Review, ReviewValues } from '@/types/api'

/** One page (5 reviews) of a product's reviews, newest first. Open to everyone. */
export async function fetchReviews(slug: string, page: number): Promise<Paginated<Review>> {
  const { data } = await api.get<Paginated<Review>>(`/products/${slug}/reviews/`, { params: { page } })
  return data
}

/** Signed in: may I review this product, and my own review if I wrote one. */
export async function fetchMyReview(slug: string): Promise<MyReview> {
  const { data } = await api.get<MyReview>(`/products/${slug}/reviews/me/`)
  return data
}

export async function createReview(slug: string, values: ReviewValues): Promise<Review> {
  const { data } = await api.post<Review>(`/products/${slug}/reviews/`, values)
  return data
}

export async function updateReview(slug: string, values: ReviewValues): Promise<Review> {
  const { data } = await api.patch<Review>(`/products/${slug}/reviews/me/`, values)
  return data
}

export async function deleteReview(slug: string): Promise<void> {
  await api.delete(`/products/${slug}/reviews/me/`)
}

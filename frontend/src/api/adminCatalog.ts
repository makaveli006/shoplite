import { api } from '@/lib/api'
import type { Product } from '@/types/api'

/** What the admin product form edits. Numbers are kept as text while typing. */
export interface ProductFormValues {
  name: string
  slug: string // may be left empty: the server makes one from the name
  category_id: string
  price: string
  stock: string
  description: string
  is_active: boolean
}

/**
 * Create (existingSlug = null) or update a product.
 * Sent as multipart/form-data so a picture can travel with the other fields (Lesson 4.6).
 */
export async function saveProduct(
  existingSlug: string | null,
  values: ProductFormValues,
  image: File | null,
  removeImage: boolean,
): Promise<Product> {
  const form = new FormData()
  form.append('name', values.name)
  if (values.slug.trim()) form.append('slug', values.slug.trim())
  form.append('category_id', values.category_id)
  form.append('price', values.price)
  form.append('stock', values.stock)
  form.append('description', values.description)
  form.append('is_active', String(values.is_active))
  if (image) form.append('image', image)

  let product = existingSlug
    ? (await api.patch<Product>(`/products/${existingSlug}/`, form)).data
    : (await api.post<Product>('/products/', form)).data

  // A form can't send "no picture", so removing the picture is a separate JSON request ({"image": null}).
  if (removeImage && !image && product.image) {
    product = (await api.patch<Product>(`/products/${product.slug}/`, { image: null })).data
  }
  return product
}

export async function setProductVisibility(slug: string, isActive: boolean): Promise<Product> {
  const { data } = await api.patch<Product>(`/products/${slug}/`, { is_active: isActive })
  return data
}

export async function deleteProduct(slug: string): Promise<void> {
  await api.delete(`/products/${slug}/`)
}

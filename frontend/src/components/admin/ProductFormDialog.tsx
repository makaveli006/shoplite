import { ImageOff } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'sonner'

import type { ProductFormValues } from '@/api/adminCatalog'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSaveProduct } from '@/hooks/useAdminProducts'
import { useCategories } from '@/hooks/useCatalog'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import type { Product } from '@/types/api'

interface Props {
  product: Product | null // null = create a new product
  open: boolean
  onOpenChange: (open: boolean) => void
}

function initialValues(product: Product | null): ProductFormValues {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category_id: product ? String(product.category.id) : '',
    price: product?.price ?? '',
    stock: product ? String(product.stock) : '0',
    description: product?.description ?? '',
    is_active: product?.is_active ?? true,
  }
}

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null
  return (
    <ul id={`${id}-errors`} className="text-sm text-destructive">
      {errors.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  )
}

/** Create or edit a product, including its picture. */
export function ProductFormDialog({ product, open, onOpenChange }: Props) {
  const categories = useCategories()
  const saveMutation = useSaveProduct()

  const [values, setValues] = useState<ProductFormValues>(() => initialValues(product))
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  // Free the temporary preview address when it's no longer shown.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function set<K extends keyof ProductFormValues>(name: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  function text(name: 'name' | 'slug' | 'price' | 'stock') {
    return {
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => set(name, event.target.value),
    }
  }

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setImage(file)
    setRemoveImage(false)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    saveMutation.mutate(
      { existingSlug: product?.slug ?? null, values, image, removeImage },
      {
        onSuccess: (saved) => {
          toast.success(product ? `"${saved.name}" was saved.` : `"${saved.name}" was created.`)
          onOpenChange(false)
        },
      },
    )
  }

  const fieldErrors = getFieldErrors(saveMutation.error)
  const generalError = saveMutation.isError && !Object.keys(fieldErrors).length
  const shownImage = previewUrl ?? (removeImage ? null : product?.image ?? null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{product ? `Edit "${product.name}"` : 'New product'}</DialogTitle>
            <DialogDescription>Fields marked * are required.</DialogDescription>
          </DialogHeader>

          {generalError && (
            <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {getErrorMessage(saveMutation.error)}
            </p>
          )}

          <FormField id="name" label="Name *" required {...text('name')} errors={fieldErrors.name} />
          <FormField
            id="slug"
            label="Web name (slug)"
            placeholder="Leave empty to create it from the name"
            {...text('slug')}
            errors={fieldErrors.slug}
          />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category *</Label>
            <Select value={values.category_id} onValueChange={(value) => set('category_id', value)}>
              <SelectTrigger id="category" className="w-full" aria-invalid={Boolean(fieldErrors.category_id)}>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {(categories.data ?? []).map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldErrors id="category" errors={fieldErrors.category_id} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="price" label="Price *" type="number" min="0.01" step="0.01" required {...text('price')} errors={fieldErrors.price} />
            <FormField id="stock" label="Stock *" type="number" min="0" step="1" required {...text('stock')} errors={fieldErrors.stock} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              value={values.description}
              onChange={(event) => set('description', event.target.value)}
              className="rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <FieldErrors id="description" errors={fieldErrors.description} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image">Picture</Label>
            <div className="flex items-center gap-3">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {shownImage ? (
                  <img src={shownImage} alt="" className="size-full object-cover" />
                ) : (
                  <ImageOff className="size-6 text-muted-foreground" aria-hidden />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input id="image" type="file" accept="image/*" onChange={chooseImage} className="text-sm" />
                {product?.image && !image && (
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />
                    Remove the current picture
                  </label>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG or WebP, at most 2 MB.</p>
            <FieldErrors id="image" errors={fieldErrors.image} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.is_active} onChange={(event) => set('is_active', event.target.checked)} />
            Visible in the shop
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending || !values.category_id}>
              {saveMutation.isPending ? 'Saving...' : product ? 'Save changes' : 'Create product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

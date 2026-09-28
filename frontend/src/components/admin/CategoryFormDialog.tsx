import { useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'sonner'

import type { CategoryFormValues } from '@/api/adminCatalog'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useSaveCategory } from '@/hooks/useAdminCategories'
import { getErrorMessage, getFieldErrors } from '@/lib/api'
import type { Category } from '@/types/api'

interface Props {
  category: Category | null // null = create a new category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryFormDialog({ category, open, onOpenChange }: Props) {
  const saveMutation = useSaveCategory()
  const [values, setValues] = useState<CategoryFormValues>({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
  })

  function field(name: 'name' | 'slug') {
    return {
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => setValues({ ...values, [name]: event.target.value }),
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    saveMutation.mutate(
      { existingSlug: category?.slug ?? null, values },
      {
        onSuccess: (saved) => {
          toast.success(category ? `"${saved.name}" was saved.` : `"${saved.name}" was created.`)
          onOpenChange(false)
        },
      },
    )
  }

  const fieldErrors = getFieldErrors(saveMutation.error)
  const generalError = saveMutation.isError && !Object.keys(fieldErrors).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{category ? `Edit "${category.name}"` : 'New category'}</DialogTitle>
            <DialogDescription>
              {category
                ? 'Changing the web name also changes category links (e.g. bookmarked filters).'
                : 'Leave the web name empty to create it from the name.'}
            </DialogDescription>
          </DialogHeader>

          {generalError && (
            <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {getErrorMessage(saveMutation.error)}
            </p>
          )}

          <FormField id="category-name" label="Name *" required {...field('name')} errors={fieldErrors.name} />
          <FormField id="category-slug" label="Web name (slug)" {...field('slug')} errors={fieldErrors.slug} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-description">Description</Label>
            <textarea
              id="category-description"
              rows={3}
              value={values.description}
              onChange={(event) => setValues({ ...values, description: event.target.value })}
              className="rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : category ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

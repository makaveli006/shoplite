import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { CategoryFormDialog } from '@/components/admin/CategoryFormDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDeleteCategory } from '@/hooks/useAdminCategories'
import { useCategories } from '@/hooks/useCatalog'
import { getErrorMessage } from '@/lib/api'
import type { Category } from '@/types/api'

export function AdminCategoriesPage() {
  const categories = useCategories()
  const deleteMutation = useDeleteCategory()

  const [editing, setEditing] = useState<Category | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<Category | null>(null)

  function openForm(category: Category | null) {
    setEditing(category)
    setFormOpen(true)
  }

  function confirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.slug, {
      onSuccess: () => toast.success(`"${deleting.name}" was deleted.`),
      // 409 from the API: "This category still has products. Move or delete them first."
      onError: (error) => toast.error(getErrorMessage(error)),
      onSettled: () => setDeleting(null),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <title>Categories · Store management | ShopLite</title>
      <div className="flex justify-end">
        <Button onClick={() => openForm(null)}>
          <Plus /> New category
        </Button>
      </div>

      {categories.isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : categories.isError ? (
        <p className="text-destructive">{getErrorMessage(categories.error)}</p>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Web name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.data.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <Link to={`/products?category=${category.slug}`} className="hover:underline">
                        {category.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{category.description || '—'}</TableCell>
                    <TableCell className="text-right">{category.product_count}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${category.name}`} onClick={() => openForm(category)}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${category.name}`} onClick={() => setDeleting(category)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CategoryFormDialog key={`${editing?.id ?? 'new'}-${String(formOpen)}`} category={editing} open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name}"?`}
        description={
          deleting?.product_count
            ? `This category still has ${deleting.product_count} product(s). The shop will refuse to delete it until they are moved to another category or deleted.`
            : 'This category has no products and will be removed.'
        }
        confirmLabel="Delete category"
        pending={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

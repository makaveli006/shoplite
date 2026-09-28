import { Eye, EyeOff, ImageOff, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { PRODUCTS_PAGE_SIZE } from '@/api/catalog'
import { ProductFormDialog } from '@/components/admin/ProductFormDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDeleteProduct, useSetProductVisibility } from '@/hooks/useAdminProducts'
import { useProducts } from '@/hooks/useCatalog'
import { getErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/api'

export function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  // For staff, the API also returns hidden products (Lesson 4.3).
  const products = useProducts({ search, page, ordering: 'name' })

  const [searchText, setSearchText] = useState(search)
  const [editing, setEditing] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const visibilityMutation = useSetProductVisibility()
  const deleteMutation = useDeleteProduct()

  function applySearch(event: FormEvent) {
    event.preventDefault()
    setSearchParams(searchText.trim() ? { search: searchText.trim() } : {})
  }

  function goToPage(newPage: number) {
    const next = new URLSearchParams(searchParams)
    if (newPage > 1) next.set('page', String(newPage))
    else next.delete('page')
    setSearchParams(next)
  }

  function openForm(product: Product | null) {
    setEditing(product)
    setFormOpen(true)
  }

  function toggleVisibility(product: Product) {
    visibilityMutation.mutate(
      { slug: product.slug, isActive: !product.is_active },
      {
        onSuccess: (saved) =>
          toast.success(saved.is_active ? `"${saved.name}" is visible in the shop again.` : `"${saved.name}" is now hidden from the shop.`),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  function confirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.slug, {
      onSuccess: () => {
        toast.success(`"${deleting.name}" was deleted.`)
        setDeleting(null)
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  const totalPages = products.data ? Math.max(1, Math.ceil(products.data.count / PRODUCTS_PAGE_SIZE)) : 1

  return (
    <div className="flex flex-col gap-4">
      <title>Products · Store management | ShopLite</title>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={applySearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="outline">
            <Search /> Search
          </Button>
        </form>
        <Button onClick={() => openForm(null)}>
          <Plus /> New product
        </Button>
      </div>

      {products.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : products.isError ? (
        <p className="text-destructive">{getErrorMessage(products.error)}</p>
      ) : (
        <Card className={cn('transition-opacity', products.isPlaceholderData && 'opacity-60')}>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14" />
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.data.results.map((product) => (
                  <TableRow key={product.id} className={cn(!product.is_active && 'text-muted-foreground')}>
                    <TableCell>
                      <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {product.image ? (
                          <img src={product.image} alt="" className="size-full object-cover" />
                        ) : (
                          <ImageOff className="size-4" aria-hidden />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link to={`/products/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                    <TableCell className={cn('text-right', product.stock === 0 && 'font-medium text-destructive')}>
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      {product.is_active ? <Badge variant="outline">Visible</Badge> : <Badge variant="secondary">Hidden</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${product.name}`} onClick={() => openForm(product)}>
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={product.is_active ? `Hide ${product.name}` : `Show ${product.name}`}
                          onClick={() => toggleVisibility(product)}
                          disabled={visibilityMutation.isPending}
                        >
                          {product.is_active ? <EyeOff /> : <Eye />}
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${product.name}`} onClick={() => setDeleting(product)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {products.data.results.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No products match your search.</p>
            )}
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Pages">
          <Button variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" disabled={!products.data?.next || products.isPlaceholderData} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        </nav>
      )}

      {/* "key": a fresh, correctly filled form every time it opens. */}
      <ProductFormDialog key={`${editing?.id ?? 'new'}-${String(formOpen)}`} product={editing} open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name}"?`}
        description="It disappears from the catalog and from every cart. Past orders keep their copy of the name and price. Hiding the product is usually the better choice."
        confirmLabel="Delete product"
        pending={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

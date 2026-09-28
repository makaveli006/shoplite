import { AlertCircle, PackageSearch } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { PRODUCTS_PAGE_SIZE } from '@/api/catalog'
import { ProductCard, ProductCardSkeleton } from '@/components/products/ProductCard'
import { ProductFilterBar, type FilterValues } from '@/components/products/ProductFilterBar'
import { Button } from '@/components/ui/button'
import { useCategories, useProducts } from '@/hooks/useCatalog'
import { getErrorMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

export function ProductsPage() {
  // All filters live in the web address (?search=mug&category=kitchen&page=2),
  // so a search can be bookmarked, shared, and undone with the Back button.
  const [searchParams, setSearchParams] = useSearchParams()
  const values: FilterValues = {
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    min_price: searchParams.get('min_price') ?? '',
    max_price: searchParams.get('max_price') ?? '',
    ordering: searchParams.get('ordering') ?? '',
  }
  const page = Number(searchParams.get('page') ?? '1')

  const products = useProducts({ ...values, page })
  const categories = useCategories()

  function changeFilters(changes: Partial<FilterValues>) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        next.delete('page') // new filters: start again at page 1
        return next
      },
      { preventScrollReset: true }, // stay where you are on the page
    )
  }

  function goToPage(newPage: number) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (newPage > 1) next.set('page', String(newPage))
      else next.delete('page')
      return next
    })
  }

  const totalPages = products.data ? Math.max(1, Math.ceil(products.data.count / PRODUCTS_PAGE_SIZE)) : 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        {products.data && (
          <p className="text-sm text-muted-foreground">
            {products.data.count} {products.data.count === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      {/* "key" rebuilds the filter bar when the address changes (e.g. Back button), so it shows the right values. */}
      <ProductFilterBar
        key={searchParams.toString()}
        values={values}
        categories={categories.data ?? []}
        onChange={changeFilters}
        onClear={() => setSearchParams({}, { preventScrollReset: true })}
      />

      {products.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
          <AlertCircle className="size-8 text-destructive" />
          <p className="font-medium">Couldn't load the products.</p>
          <p className="text-sm text-muted-foreground">{getErrorMessage(products.error)}</p>
          <Button variant="outline" onClick={() => products.refetch()}>
            Try again
          </Button>
        </div>
      ) : products.data.results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10">
          <PackageSearch className="size-8 text-muted-foreground" />
          <p className="font-medium">No products match your filters.</p>
          <Button variant="outline" onClick={() => setSearchParams({})}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {/* Slightly faded while the next result is loading in the background. */}
          <div
            className={cn(
              'grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
              products.isPlaceholderData && 'opacity-60',
            )}
          >
            {products.data.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-3" aria-label="Pages">
              <Button variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!products.data.next || products.isPlaceholderData}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}

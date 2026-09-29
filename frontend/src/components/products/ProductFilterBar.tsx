import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Category } from '@/types/api'

import { SearchBox } from './SearchBox'

const ALL = 'all' // Select items can't have an empty value, so "all categories" gets its own word.

// Only offered while searching: the server's ranking of how well each product matches.
const BEST_MATCH = { value: '-relevance', label: 'Best match' }

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest first' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: '-rating', label: 'Top rated' },
]

export interface FilterValues {
  search: string
  category: string
  min_price: string
  max_price: string
  ordering: string
}

interface Props {
  values: FilterValues
  categories: Category[]
  onChange: (changes: Partial<FilterValues>) => void
  onClear: () => void
}

/**
 * Search box (with suggestions while typing), category, price range and sort order.
 * Category and sort apply immediately; search text and prices apply when you press Enter or "Search".
 * While searching, the default sort is "Best match".
 */
export function ProductFilterBar({ values, categories, onChange, onClear }: Props) {
  // What's typed but not applied yet. Starts from the web address.
  const [search, setSearch] = useState(values.search)
  const [minPrice, setMinPrice] = useState(values.min_price)
  const [maxPrice, setMaxPrice] = useState(values.max_price)

  function apply(event: FormEvent) {
    event.preventDefault() // don't let the browser reload the page
    const changes: Partial<FilterValues> = { search: search.trim(), min_price: minPrice, max_price: maxPrice }
    // "Best match" means nothing without a search: go back to the normal order.
    if (!changes.search && values.ordering === BEST_MATCH.value) changes.ordering = ''
    onChange(changes)
  }

  const hasFilters = Object.values(values).some(Boolean)
  const searching = Boolean(values.search)
  const sortOptions = searching ? [BEST_MATCH, ...SORT_OPTIONS] : SORT_OPTIONS
  const sort = values.ordering || (searching ? BEST_MATCH.value : '-created_at')

  return (
    <form onSubmit={apply} className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex gap-2">
        <SearchBox value={search} onChange={setSearch} />
        <Button type="submit">
          <Search /> Search
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={values.category || ALL}
          onValueChange={(value) => onChange({ category: value === ALL ? '' : value })}
        >
          <SelectTrigger className="w-44" aria-label="Category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Min price"
          aria-label="Minimum price"
          className="w-28"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Max price"
          aria-label="Maximum price"
          className="w-28"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <Select value={sort} onValueChange={(value) => onChange({ ordering: value })}>
          <SelectTrigger className="w-48" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button type="button" variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </div>
    </form>
  )
}

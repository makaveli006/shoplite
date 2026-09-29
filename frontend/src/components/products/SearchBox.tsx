import { ImageOff } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'

import { Input } from '@/components/ui/input'
import { useProductSuggestions } from '@/hooks/useCatalog'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ProductSuggestion } from '@/types/api'

interface Props {
  value: string
  onChange: (value: string) => void
}

/**
 * The search input with a dropdown of matching products while typing.
 *
 * Keyboard: ↓/↑ move through the suggestions, Enter opens the highlighted product (with none
 * highlighted, Enter runs a normal search through the surrounding form), Escape closes the list.
 * The roles and aria-* attributes let screen readers announce it as a "combobox" with a list.
 */
export function SearchBox({ value, onChange }: Props) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // only after typing, not when the page loads with a search
  const [active, setActive] = useState(-1) // highlighted suggestion (-1: none)
  const listId = useId()

  // Ask the server once typing pauses, not on every key.
  const term = useDebouncedValue(value.trim(), 250)
  const suggestions = useProductSuggestions(term)
  const items: ProductSuggestion[] = open && term.length >= 2 ? (suggestions.data ?? []) : []
  const expanded = items.length > 0
  const optionId = (index: number) => `${listId}-option-${index}`

  function choose(item: ProductSuggestion) {
    setOpen(false)
    navigate(`/products/${item.slug}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && expanded) {
      event.preventDefault()
      setActive((index) => (index + 1) % items.length)
    } else if (event.key === 'ArrowUp' && expanded) {
      event.preventDefault()
      setActive((index) => (index <= 0 ? items.length - 1 : index - 1))
    } else if (event.key === 'Enter' && expanded && active >= 0) {
      event.preventDefault() // open the product instead of submitting the search form
      choose(items[active])
    } else if (event.key === 'Escape' && expanded) {
      event.preventDefault()
      setOpen(false)
      setActive(-1)
    } else if (event.key === 'Enter') {
      setOpen(false) // a normal search: the form submits as usual
    }
  }

  return (
    <div className="relative flex-1">
      <Input
        type="search"
        role="combobox"
        placeholder="Search products..."
        aria-label="Search products"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
        autoComplete="off"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
      />
      {expanded && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10"
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === active}
              // mousedown would take the focus away from the input (closing the list) before the click.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(item)}
              onMouseEnter={() => setActive(index)}
              className={cn('flex cursor-pointer items-center gap-3 px-3 py-2 text-sm', index === active && 'bg-muted')}
            >
              <span className="size-9 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image ? (
                  <img src={item.image} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-4" aria-hidden />
                  </span>
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{item.name}</span>
                <span className="truncate text-xs text-muted-foreground">{item.category.name}</span>
              </span>
              <span className="shrink-0 text-muted-foreground">{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

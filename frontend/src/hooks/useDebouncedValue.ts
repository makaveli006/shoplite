import { useEffect, useState } from 'react'

/**
 * The value, but only after it stopped changing for `delay` milliseconds. While someone types
 * "headphones", this gives "headphones" once, instead of "h", "he", "hea"... (one request, not ten).
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // typed again before the delay: start waiting again
  }, [value, delay])

  return debounced
}

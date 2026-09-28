import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface Props {
  value: number
  max: number
  onChange: (value: number) => void
}

/** "−  2  +" : choose how many, between 1 and `max`. */
export function QuantityPicker({ value, max, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg ring-1 ring-foreground/10">
      <Button
        variant="ghost"
        size="icon"
        aria-label="One less"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <span className="w-8 text-center font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="One more"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  )
}

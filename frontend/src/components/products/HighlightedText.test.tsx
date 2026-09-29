import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HighlightedText } from './HighlightedText'

describe('HighlightedText', () => {
  it('highlights the words between the markers', () => {
    const { container } = render(<HighlightedText text={'A 350 ml \u0002stoneware\u0003 \u0002mug\u0003 with a glaze.'} />)

    const marks = [...container.querySelectorAll('mark')].map((mark) => mark.textContent)
    expect(marks).toEqual(['stoneware', 'mug'])
    expect(container.textContent).toBe('A 350 ml stoneware mug with a glaze.')
  })

  it('never treats the text as HTML', () => {
    const { container } = render(<HighlightedText text={'<b>bold</b> \u0002knife\u0003'} />)

    expect(container.querySelector('b')).toBeNull()
    expect(container.textContent).toBe('<b>bold</b> knife')
  })
})

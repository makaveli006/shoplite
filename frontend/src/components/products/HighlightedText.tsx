import { Fragment } from 'react'

// The two invisible characters the backend puts around matched words (catalog/search.py).
const START = '\u0002'
const END = '\u0003'

/**
 * "A 350 ml \u0002stoneware\u0003 mug" -> "A 350 ml <mark>stoneware</mark> mug".
 * The text is never treated as HTML, so a "<" in a product description stays a "<".
 */
export function HighlightedText({ text }: { text: string }) {
  const [before, ...marked] = text.split(START)
  return (
    <>
      {before}
      {marked.map((part, index) => {
        const [match, after = ''] = part.split(END)
        return (
          <Fragment key={index}>
            <mark className="rounded-sm bg-amber-200/70 px-0.5 text-foreground">{match}</mark>
            {after}
          </Fragment>
        )
      })}
    </>
  )
}

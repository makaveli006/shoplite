import { Link } from 'react-router'

import { PagePlaceholder } from '@/components/PagePlaceholder'

// Until the real list arrives (Lesson 11.2), a few links to try the product page with.
const sampleSlugs = ['blue-ceramic-mug', 'chef-knife', 'wireless-mouse']

export function ProductsPage() {
  return (
    <PagePlaceholder title="Products" lesson="Lesson 11.2">
      <p className="mb-2 text-sm text-muted-foreground">Try a product page:</p>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {sampleSlugs.map((slug) => (
          <li key={slug}>
            <Link to={`/products/${slug}`} className="underline underline-offset-4">
              /products/{slug}
            </Link>
          </li>
        ))}
      </ul>
    </PagePlaceholder>
  )
}

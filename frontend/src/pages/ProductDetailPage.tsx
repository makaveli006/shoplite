import { Link, useParams } from 'react-router'

import { PagePlaceholder } from '@/components/PagePlaceholder'

export function ProductDetailPage() {
  // The ":slug" part of the web address, e.g. "chef-knife" for /products/chef-knife
  const { slug } = useParams()

  return (
    <PagePlaceholder title={`Product: ${slug}`} lesson="Lesson 11.3">
      <Link to="/products" className="text-sm underline underline-offset-4">
        Back to all products
      </Link>
    </PagePlaceholder>
  )
}

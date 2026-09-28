import { PagePlaceholder } from '@/components/PagePlaceholder'

export function AdminHomePage() {
  return (
    <PagePlaceholder title="Store management" lesson="Phase 14">
      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
        <li>Products: create, edit, upload images, hide</li>
        <li>Categories</li>
        <li>Orders: mark as paid, shipped, delivered or cancelled</li>
      </ul>
    </PagePlaceholder>
  )
}

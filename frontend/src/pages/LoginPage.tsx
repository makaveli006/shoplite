import { Link } from 'react-router'

import { PagePlaceholder } from '@/components/PagePlaceholder'

export function LoginPage() {
  return (
    <PagePlaceholder title="Sign in" lesson="Phase 12">
      <p className="text-sm">
        No account yet?{' '}
        <Link to="/register" className="underline underline-offset-4">
          Create one
        </Link>
      </p>
    </PagePlaceholder>
  )
}

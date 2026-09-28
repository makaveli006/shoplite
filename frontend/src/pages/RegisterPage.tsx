import { Link } from 'react-router'

import { PagePlaceholder } from '@/components/PagePlaceholder'

export function RegisterPage() {
  return (
    <PagePlaceholder title="Create an account" lesson="Phase 12">
      <p className="text-sm">
        Already registered?{' '}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </PagePlaceholder>
  )
}

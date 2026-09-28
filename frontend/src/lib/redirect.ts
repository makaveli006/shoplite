/**
 * The page to return to after logging in, taken from "?next=/products/chef-knife".
 * Only addresses inside our own shop are accepted: "?next=https://evil.example" or
 * "?next=//evil.example" would otherwise send customers to another website after login.
 */
export function safeNext(next: string | null, fallback = '/'): string {
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next
  }
  return fallback
}

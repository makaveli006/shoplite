import { describe, expect, it } from 'vitest'

import { safeNext } from './redirect'

describe('safeNext', () => {
  it('accepts addresses inside the shop', () => {
    expect(safeNext('/products/chef-knife')).toBe('/products/chef-knife')
    expect(safeNext('/orders?page=2')).toBe('/orders?page=2')
  })

  it('refuses addresses on other websites (open redirect)', () => {
    expect(safeNext('https://evil.example')).toBe('/')
    expect(safeNext('//evil.example')).toBe('/')
    expect(safeNext('javascript:alert(1)')).toBe('/')
  })

  it('uses the fallback when there is no address', () => {
    expect(safeNext(null)).toBe('/')
    expect(safeNext(null, '/account')).toBe('/account')
  })
})

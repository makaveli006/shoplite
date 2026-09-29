// Runs before every test file.
import '@testing-library/jest-dom/vitest' // adds checks like toBeInTheDocument() and toBeDisabled()
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Remove whatever a test drew, so the next test starts with an empty page.
afterEach(() => cleanup())

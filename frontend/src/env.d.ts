// The settings read from frontend/.env, so TypeScript knows they exist.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CURRENCY?: string
}

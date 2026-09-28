import { Outlet, ScrollRestoration } from 'react-router'

import { SiteHeader } from './SiteHeader'

/** The frame around every page: header on top, the current page in the middle, footer below. */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {/* The page that matches the current web address is shown here. */}
        <Outlet />
      </main>
      <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
        ShopLite - a learning project
      </footer>
      {/* Start each new page at the top; restore the old position on Back/Forward. */}
      <ScrollRestoration />
    </div>
  )
}

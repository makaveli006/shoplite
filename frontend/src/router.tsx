import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/components/layout/RootLayout'
import { CartPage } from '@/pages/CartPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { RegisterPage } from '@/pages/RegisterPage'

// Which page is shown for which web address. All pages sit inside RootLayout
// (header + footer), which shows the matching page where it has <Outlet />.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage }, // exactly "/"
      { path: 'products', Component: ProductsPage },
      { path: 'products/:slug', Component: ProductDetailPage }, // ":slug" = any product's web name
      { path: 'cart', Component: CartPage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      { path: '*', Component: NotFoundPage }, // anything else
    ],
  },
])

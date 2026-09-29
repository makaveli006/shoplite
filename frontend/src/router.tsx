import { createBrowserRouter, Navigate } from 'react-router'

import { RequireAdmin, RequireAuth } from '@/components/auth/RouteGuards'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'

// Which page is shown for which web address. All pages sit inside RootLayout
// (header + footer), which shows the matching page where it has <Outlet />.
//
// The pages every visitor sees are loaded right away. The others are loaded only when
// someone first opens them ("lazy"), so the first visit downloads less. Customers never
// download the admin screens at all.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      // Open to everyone
      { index: true, Component: HomePage }, // exactly "/"
      { path: 'products', Component: ProductsPage },
      { path: 'products/:slug', Component: ProductDetailPage }, // ":slug" = any product's web name
      { path: 'login', lazy: async () => ({ Component: (await import('@/pages/LoginPage')).LoginPage }) },
      { path: 'register', lazy: async () => ({ Component: (await import('@/pages/RegisterPage')).RegisterPage }) },
      {
        path: 'forgot-password',
        lazy: async () => ({ Component: (await import('@/pages/ForgotPasswordPage')).ForgotPasswordPage }),
      },
      {
        path: 'reset-password/:uid/:token', // the link from the reset email
        lazy: async () => ({ Component: (await import('@/pages/ResetPasswordPage')).ResetPasswordPage }),
      },

      // Signed-in customers only
      {
        Component: RequireAuth,
        children: [
          { path: 'cart', lazy: async () => ({ Component: (await import('@/pages/CartPage')).CartPage }) },
          { path: 'checkout', lazy: async () => ({ Component: (await import('@/pages/CheckoutPage')).CheckoutPage }) },
          { path: 'orders', lazy: async () => ({ Component: (await import('@/pages/OrdersPage')).OrdersPage }) },
          {
            path: 'orders/:id',
            lazy: async () => ({ Component: (await import('@/pages/OrderDetailPage')).OrderDetailPage }),
          },
          { path: 'account', lazy: async () => ({ Component: (await import('@/pages/AccountPage')).AccountPage }) },
        ],
      },

      // Staff only
      {
        path: 'admin',
        Component: RequireAdmin,
        children: [
          {
            lazy: async () => ({ Component: (await import('@/components/admin/AdminLayout')).AdminLayout }), // title + tabs
            children: [
              { index: true, element: <Navigate to="products" replace /> }, // /admin opens the products tab
              {
                path: 'products',
                lazy: async () => ({ Component: (await import('@/pages/admin/AdminProductsPage')).AdminProductsPage }),
              },
              {
                path: 'categories',
                lazy: async () => ({ Component: (await import('@/pages/admin/AdminCategoriesPage')).AdminCategoriesPage }),
              },
              {
                path: 'orders',
                lazy: async () => ({ Component: (await import('@/pages/admin/AdminOrdersPage')).AdminOrdersPage }),
              },
            ],
          },
        ],
      },

      { path: '*', Component: NotFoundPage }, // anything else
    ],
  },
])

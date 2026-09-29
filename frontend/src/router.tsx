import { createBrowserRouter, Navigate } from 'react-router'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { RequireAdmin, RequireAuth } from '@/components/auth/RouteGuards'
import { RootLayout } from '@/components/layout/RootLayout'
import { AccountPage } from '@/pages/AccountPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { OrdersPage } from '@/pages/OrdersPage'
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
      // Open to everyone
      { index: true, Component: HomePage }, // exactly "/"
      { path: 'products', Component: ProductsPage },
      { path: 'products/:slug', Component: ProductDetailPage }, // ":slug" = any product's web name
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },

      // Signed-in customers only
      {
        Component: RequireAuth,
        children: [
          { path: 'cart', Component: CartPage },
          { path: 'checkout', Component: CheckoutPage },
          { path: 'orders', Component: OrdersPage },
          { path: 'orders/:id', Component: OrderDetailPage },
          { path: 'account', Component: AccountPage },
        ],
      },

      // Staff only
      {
        path: 'admin',
        Component: RequireAdmin,
        children: [
          {
            Component: AdminLayout, // title + tabs
            children: [
              { index: true, element: <Navigate to="products" replace /> }, // /admin opens the products tab
              { path: 'products', Component: AdminProductsPage },
              { path: 'categories', Component: AdminCategoriesPage },
              { path: 'orders', Component: AdminOrdersPage },
            ],
          },
        ],
      },

      { path: '*', Component: NotFoundPage }, // anything else
    ],
  },
])

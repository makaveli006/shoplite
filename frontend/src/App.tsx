import { ShieldCheck, ShoppingBag, ShoppingCart, Truck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const features = [
  {
    icon: ShoppingBag,
    title: 'Hand-picked products',
    text: 'Kitchen, stationery, home and garden, electronics and books.',
  },
  {
    icon: Truck,
    title: 'Order tracking',
    text: 'Follow every order from pending to paid, shipped and delivered.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    text: 'Your cart is checked again at checkout, so you never pay for an item that is gone.',
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-xl font-bold tracking-tight">ShopLite</span>
          <nav className="flex items-center gap-2">
            <Button variant="ghost">Products</Button>
            <Button variant="ghost">Sign in</Button>
            <Button variant="outline" size="icon" aria-label="Cart">
              <ShoppingCart />
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <section className="flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary">Coming soon</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to ShopLite</h1>
          <p className="max-w-xl text-muted-foreground">
            A small shop built step by step with Django, React, PostgreSQL and Celery.
          </p>
          <div className="flex gap-3">
            <Button size="lg">Browse products</Button>
            <Button size="lg" variant="outline">
              Create an account
            </Button>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="size-6 text-primary" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
        ShopLite - a learning project
      </footer>
    </div>
  )
}

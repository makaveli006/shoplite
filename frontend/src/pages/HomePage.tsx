import { ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export function HomePage() {
  return (
    <>
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <Badge variant="secondary">Now open</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to ShopLite</h1>
        <p className="max-w-xl text-muted-foreground">
          A small shop built step by step with Django, React, PostgreSQL and Celery.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link to="/products">Browse products</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/register">Create an account</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-10" />

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-6 text-primary" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </>
  )
}

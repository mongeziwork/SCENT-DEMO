import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Returns | SCENT',
  description: 'Returns and exchanges policy for SCENT.',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase text-foreground">
              Returns & Exchanges
            </h1>
            <Button asChild variant="outline" size="sm">
              <Link href="/contact">Need help?</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            This page is a simple placeholder you can refine. Add your exact timelines and requirements
            once you finalize fulfilment and courier terms.
          </p>

          <div className="mt-10 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Return window</CardTitle>
                <CardDescription>When you can request a return</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  Requests are typically accepted within <span className="text-foreground">7 days</span>{' '}
                  of delivery for unworn items in original condition.
                </p>
                <p>
                  For hygiene reasons, certain items may be final sale. If you offer exceptions, state
                  them here clearly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to start a return</CardTitle>
                <CardDescription>What we need from you</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Order ID (from your confirmation email)</li>
                  <li>Item(s) to return and reason</li>
                  <li>Preferred outcome: exchange or refund</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refunds</CardTitle>
                <CardDescription>Timing and method</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  Refunds are processed after inspection. Bank processing times vary by provider and
                  can take a few business days.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/shipping">Shipping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/privacy-policy">Privacy policy</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


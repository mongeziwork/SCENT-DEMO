import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-light tracking-widest uppercase">Shipping</CardTitle>
              <CardDescription>Delivery information for SCENT orders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <div className="pt-2 space-y-2">
                <div className="text-xs tracking-widest uppercase text-foreground">Processing time</div>
                <p>Orders are typically processed within 1–2 business days (excluding weekends and public holidays).</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-foreground">Delivery times</div>
                <p>
                  Delivery times vary by location. Once shipped, you’ll receive a confirmation with tracking details (if
                  available).
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-foreground">Shipping fees</div>
                <p>Shipping costs are shown at checkout before payment is completed.</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-foreground">Questions</div>
                <p>
                  If you need help with an order, contact us and include your order reference.
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/contact">Contact support</Link>
                </Button>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="text-xs tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                >
                  Continue shopping
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


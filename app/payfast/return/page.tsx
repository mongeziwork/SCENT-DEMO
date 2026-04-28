import Link from 'next/link'

type PageProps = {
  searchParams: Promise<{ order_id?: string }>
}

export default async function PayFastReturnPage({ searchParams }: PageProps) {
  const { order_id } = await searchParams
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Payment received
          </h1>
          <p className="mt-4 text-muted-foreground">
            Thanks for your order. We’ll confirm once payment is verified.
          </p>
          {order_id && (
            <p className="mt-6 text-sm text-muted-foreground">
              Order: <span className="font-mono">{order_id}</span>
            </p>
          )}
          <div className="mt-10 flex justify-center gap-3">
            <Link
              href="/shop"
              className="px-5 py-3 border border-border text-foreground text-xs tracking-widest uppercase font-medium hover:border-foreground transition-colors"
            >
              Continue shopping
            </Link>
            <Link
              href="/cart"
              className="px-5 py-3 bg-foreground text-background text-xs tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


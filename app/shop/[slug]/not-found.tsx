import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">SCENT</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Product not found
          </h1>
          <p className="mt-6 text-muted-foreground">
            This product page doesn’t exist (or the link is outdated).
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="px-6 py-4 bg-foreground text-background text-xs tracking-widest uppercase font-medium"
            >
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


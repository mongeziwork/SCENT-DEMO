import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Privacy Policy | SCENT',
  description: 'How SCENT collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Information we collect</CardTitle>
                <CardDescription>What we may collect when you browse and shop.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  We may collect information you provide (such as your name, email, phone number, and
                  shipping address) when you place an order or contact us.
                </p>
                <p>
                  We may also collect limited technical data (like device and browser information)
                  to help us improve site reliability and performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How we use your information</CardTitle>
                <CardDescription>We use your details to run the store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>To process and deliver orders.</li>
                  <li>To provide customer support.</li>
                  <li>To prevent fraud and secure transactions.</li>
                  <li>To improve our products and website experience.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sharing</CardTitle>
                <CardDescription>When we may share information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  We may share necessary information with payment providers and delivery partners
                  to complete your order. We do not sell personal information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your choices</CardTitle>
                <CardDescription>Access, updates, and marketing preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  You can request access, correction, or deletion of personal information by
                  contacting us via the details on the Contact page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}


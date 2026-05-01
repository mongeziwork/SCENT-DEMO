'use client'

import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PortalHomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
      <Card>
        <CardHeader>
          <CardTitle>Owner portal</CardTitle>
          <CardDescription>Restricted access.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            You’re signed in to the portal.
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


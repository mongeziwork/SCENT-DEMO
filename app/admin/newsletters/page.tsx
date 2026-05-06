'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export const dynamic = 'force-dynamic'

type CampaignRow = {
  id: string
  name: string
  subject: string
  body: string
  status: string
  sent_count: number
  sent_at: string | null
  created_at: string
}

const emptyForm = {
  id: undefined as string | undefined,
  name: '',
  subject: '',
  body: '',
}

export default function AdminNewslettersPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const { toast } = useToast()

  const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [confirmSendId, setConfirmSendId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = useCallback(async () => {
    setLoading(true)
    const [campRes, subRes] = await Promise.all([
      supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('marketing_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'subscribed'),
    ])

    if (campRes.error) {
      toast({
        title: 'Could not load campaigns',
        description: campRes.error.message.includes('relation')
          ? 'Run the newsletter migration on your Supabase project (newsletter_campaigns table).'
          : campRes.error.message,
        variant: 'destructive',
      })
      setCampaigns([])
    } else {
      setCampaigns((campRes.data ?? []) as CampaignRow[])
    }

    setSubscriberCount(subRes.error ? null : (subRes.count ?? 0))
    setLoading(false)
  }, [supabase, toast])

  useEffect(() => {
    void load()
  }, [load])

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function selectCampaign(c: CampaignRow) {
    setForm({
      id: c.id,
      name: c.name,
      subject: c.subject,
      body: c.body,
    })
  }

  function newCampaign() {
    setForm(emptyForm)
  }

  async function saveDraft() {
    const name = form.name.trim()
    const subject = form.subject.trim()
    const body = form.body.trim()
    if (!name || !subject || !body) {
      toast({
        title: 'Missing fields',
        description: 'Name, subject, and body are required.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    if (form.id) {
      const { error } = await supabase
        .from('newsletter_campaigns')
        .update({ name, subject, body })
        .eq('id', form.id)
        .eq('status', 'draft')

      if (error) {
        toast({ title: 'Save failed', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Draft saved' })
        await load()
      }
    } else {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .insert({ name, subject, body })
        .select('id')
        .single()

      if (error) {
        toast({ title: 'Save failed', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Draft created' })
        setForm((f) => ({ ...f, id: data?.id }))
        await load()
      }
    }
    setSaving(false)
  }

  async function deleteDraft(id: string) {
    const { error } = await supabase.from('newsletter_campaigns').delete().eq('id', id).eq('status', 'draft')
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Draft deleted' })
    if (form.id === id) setForm(emptyForm)
    await load()
  }

  async function sendCampaign(id: string) {
    setConfirmSendId(null)
    setSendingId(id)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) {
        toast({ title: 'Not signed in', variant: 'destructive' })
        return
      }

      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId: id }),
      })

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        sent?: number
        skipped?: number
        failures?: string[]
      }

      if (!res.ok) {
        toast({
          title: 'Send failed',
          description: json.error ?? `HTTP ${res.status}`,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Campaign sent',
        description: `Delivered to ${json.sent ?? 0} addresses${
          json.skipped ? ` (${json.skipped} skipped or failed)` : ''
        }.`,
      })
      if (json.failures?.length) {
        toast({
          title: 'Some sends failed',
          description: json.failures.slice(0, 3).join(' · '),
          variant: 'destructive',
        })
      }
      setForm(emptyForm)
      await load()
    } finally {
      setSendingId(null)
    }
  }

  const pendingSend = confirmSendId ? campaigns.find((c) => c.id === confirmSendId) : null

  return (
    <div className="p-6 lg:p-10 max-w-6xl space-y-8">
      <AlertDialog open={Boolean(confirmSendId)} onOpenChange={(o) => !o && setConfirmSendId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send this campaign?</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-2">
              <span className="block">
                This emails every address in <strong>marketing_subscribers</strong> with status{' '}
                <strong>subscribed</strong>
                {subscriberCount != null ? ` (${subscriberCount} recipients)` : ''}.
              </span>
              {pendingSend ? (
                <span className="block text-foreground">
                  Subject: <em>{pendingSend.subject}</em>
                </span>
              ) : null}
              <span className="block text-xs text-muted-foreground">
                Uses Resend (<code className="text-[11px]">RESEND_API_KEY</code> and{' '}
                <code className="text-[11px]">CONTACT_FROM_EMAIL</code> or{' '}
                <code className="text-[11px]">NEWSLETTER_FROM_EMAIL</code>).
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmSendId) void sendCampaign(confirmSendId)
              }}
            >
              Send now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Newsletters</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Draft campaigns and send plain-text email to subscribed customers. Subscribers come from
            sign-ups captured in <span className="font-mono">marketing_subscribers</span>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/subscribers">Subscribers</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-border bg-card/30">
          <CardHeader>
            <CardTitle className="text-base font-normal">
              {form.id ? 'Edit draft' : 'New campaign'}
            </CardTitle>
            <CardDescription>
              {subscriberCount != null ? (
                <span>
                  <strong>{subscriberCount}</strong> subscribed recipients
                </span>
              ) : (
                'Subscriber count unavailable'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Internal name</div>
              <Input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Spring launch" />
            </div>
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Email subject</div>
              <Input
                value={form.subject}
                onChange={(e) => setField('subject', e.target.value)}
                placeholder="New arrivals at SCENT"
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Body (plain text)</div>
              <Textarea
                value={form.body}
                onChange={(e) => setField('body', e.target.value)}
                placeholder="Write your message…"
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={() => void saveDraft()} disabled={saving}>
                {saving ? 'Saving…' : 'Save draft'}
              </Button>
              <Button type="button" variant="outline" onClick={newCampaign} disabled={saving}>
                New campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/30">
          <CardHeader>
            <CardTitle className="text-base font-normal">Campaigns</CardTitle>
            <CardDescription>{loading ? 'Loading…' : `${campaigns.length} total`}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => selectCampaign(c)}
                        className="text-left hover:underline underline-offset-4 text-sm"
                      >
                        {c.name}
                      </button>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{c.subject}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'sent' ? 'secondary' : 'default'}>
                        {c.status === 'sent' ? 'Sent' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.status === 'sent' ? (
                        <>
                          {c.sent_count} · {c.sent_at ? new Date(c.sent_at).toLocaleString() : '—'}
                        </>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {c.status === 'draft' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={sendingId === c.id}
                              onClick={() => setConfirmSendId(c.id)}
                            >
                              Send
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => void deleteDraft(c.id)}>
                              Delete
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Read-only</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No campaigns yet. Create a draft on the left.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

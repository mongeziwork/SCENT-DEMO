'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { AdminAuthGate } from '@/components/admin-auth-gate'

type OrderStatus = 'pending' | 'paid' | 'shipped'

export const dynamic = 'force-dynamic'

type OrderItemRow = {
  id: string
  product_id: string
  name: string
  slug: string | null
  price: string | number
  quantity: number
  color: string | null
  size: string | null
}

type OrderRow = {
  id: string
  status: OrderStatus | string
  currency: string
  subtotal: string | number
  total: string | number
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  shipping_address: string | null
  created_at: string | null
  updated_at: string | null
  order_items: OrderItemRow[] | null
}

const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped']

function formatMoney(amount: string | number, currency: string) {
  const value = Number(amount)
  return `${currency === 'ZAR' ? 'R' : currency + ' '}${(Number.isFinite(value) ? value : 0).toFixed(2)}`
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' {
  if (status === 'paid') return 'default'
  if (status === 'shipped') return 'secondary'
  return 'outline'
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)

  const [rows, setRows] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select(
        'id,status,currency,subtotal,total,customer_name,customer_email,customer_phone,shipping_address,created_at,updated_at,order_items(id,product_id,name,slug,price,quantity,color,size)',
      )
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: 'Failed to load orders',
        description: error.message,
        variant: 'destructive',
      })
      setRows([])
    } else {
      setRows((data ?? []) as OrderRow[])
    }

    setLoading(false)
  }, [supabase, toast])

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    void load()
  }, [load])

  async function updateStatus(order: OrderRow, status: OrderStatus) {
    setSavingId(order.id)
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (error) {
      toast({
        title: 'Status update failed',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setRows((prev) => prev.map((row) => (row.id === order.id ? { ...row, status } : row)))
      toast({
        title: 'Order updated',
        description: `Order marked ${status}.`,
      })
    }

    setSavingId(null)
  }

  return (
    <AdminAuthGate>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase">Orders</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage Supabase orders, linked products, and fulfilment status.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/admin">Admin home</Link>
            </Button>
            <Button variant="outline" onClick={() => void load()} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>All orders</CardTitle>
            <CardDescription>{loading ? 'Loading…' : `${rows.length} orders`}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((order) => {
                  const items = order.order_items ?? []
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="align-top">
                        <div className="font-mono text-xs">{order.id.slice(0, 8)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="text-sm">{order.customer_name ?? '—'}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {order.customer_email ?? 'No email'}
                        </div>
                        {order.customer_phone ? (
                          <div className="mt-1 text-xs text-muted-foreground">{order.customer_phone}</div>
                        ) : null}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="space-y-2">
                          {items.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No linked products</div>
                          ) : (
                            items.map((item) => {
                              const href = item.slug ? `/shop/${item.slug}` : `/admin/products`
                              return (
                                <div key={item.id} className="text-sm">
                                  <Link href={href} className="hover:underline underline-offset-4">
                                    {item.name}
                                  </Link>
                                  <span className="text-muted-foreground"> × {item.quantity}</span>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMoney(item.price, order.currency)}
                                    {item.color ? ` · ${item.color}` : ''}
                                    {item.size ? ` · ${item.size}` : ''}
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={statusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-right">
                        {formatMoney(order.total, order.currency)}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap justify-end gap-2">
                          {ORDER_STATUSES.map((status) => (
                            <Button
                              key={status}
                              variant={order.status === status ? 'default' : 'outline'}
                              className="h-8 px-3"
                              disabled={savingId === order.id || order.status === status}
                              onClick={() => void updateStatus(order, status)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminAuthGate>
  )
}

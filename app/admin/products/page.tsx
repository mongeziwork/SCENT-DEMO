'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { formatZar } from '@/lib/currency'

type ProductRow = {
  id: string
  name: string
  slug: string | null
  description: string | null
  price: string | number
  image_url: string | null
  stock: number | null
  is_active: boolean | null
  category: string | null
  color_options: string[] | null
  size_options: string[] | null
  updated_at: string | null
}

type ProductFormState = {
  id?: string
  name: string
  slug: string
  description: string
  price: string
  image_url: string
  stock: string
  category: string
  color_options: string
  size_options: string
  is_active: boolean
}

const emptyForm: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  price: '',
  image_url: '',
  stock: '0',
  category: '',
  color_options: '',
  size_options: '',
  is_active: true,
}

function parseOptions(input: string) {
  const items = input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return Array.from(new Set(items))
}

export default function AdminProductsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const { toast } = useToast()

  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState<ProductFormState>(emptyForm)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(
        'id,name,slug,description,price,image_url,stock,is_active,category,color_options,size_options,updated_at',
      )
      .order('updated_at', { ascending: false })

    if (error) {
      toast({
        title: 'Failed to load products',
        description: error.message,
        variant: 'destructive',
      })
      setRows([])
    } else {
      setRows((data ?? []) as ProductRow[])
    }

    setLoading(false)
  }, [supabase, toast])

  useEffect(() => {
    void load()
  }, [load])

  function setField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
  }

  function selectForEdit(r: ProductRow) {
    setForm({
      id: r.id,
      name: r.name ?? '',
      slug: r.slug ?? '',
      description: r.description ?? '',
      price: String(r.price ?? ''),
      image_url: r.image_url ?? '',
      stock: String(r.stock ?? 0),
      category: r.category ?? '',
      color_options: (r.color_options ?? []).join(', '),
      size_options: (r.size_options ?? []).join(', '),
      is_active: r.is_active ?? true,
    })
  }

  async function save() {
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      image_url: form.image_url.trim() || null,
      stock: Number(form.stock),
      category: form.category.trim() || null,
      color_options: parseOptions(form.color_options),
      size_options: parseOptions(form.size_options),
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    if (!payload.name || !payload.slug || Number.isNaN(payload.price)) {
      toast({
        title: 'Missing required fields',
        description: 'Name, slug, and a valid price are required.',
        variant: 'destructive',
      })
      setSaving(false)
      return
    }

    const res = form.id
      ? await supabase.from('products').update(payload).eq('id', form.id).select('id').single()
      : await supabase.from('products').insert(payload).select('id').single()

    if (res.error) {
      toast({
        title: 'Save failed',
        description: res.error.message,
        variant: 'destructive',
      })
      setSaving(false)
      return
    }

    toast({
      title: form.id ? 'Product updated' : 'Product created',
      description: payload.name,
    })
    resetForm()
    await load()
    setSaving(false)
  }

  async function remove(id: string) {
    setDeletingId(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Deleted' })
      if (form.id === id) resetForm()
      await load()
    }
    setDeletingId(null)
  }

  async function toggleActive(r: ProductRow) {
    const next = !(r.is_active ?? true)
    const { error } = await supabase.from('products').update({ is_active: next }).eq('id', r.id)
    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      })
      return
    }
    setRows((prev) => prev.map((p) => (p.id === r.id ? { ...p, is_active: next } : p)))
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-widest uppercase">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Basic CRUD for <span className="font-mono">public.products</span>. If writes fail, check RLS
            policies.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetForm}>
            New
          </Button>
          <Button variant="outline" onClick={() => void load()} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{form.id ? 'Edit product' : 'Create product'}</CardTitle>
            <CardDescription>Slug must be unique.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Name</div>
              <Input value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Slug</div>
              <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">Price</div>
                <Input
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">Stock</div>
                <Input
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Category</div>
              <Input value={form.category} onChange={(e) => setField('category', e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">
                Color options
              </div>
              <Input
                value={form.color_options}
                onChange={(e) => setField('color_options', e.target.value)}
                placeholder="Black, White, Navy"
              />
              <div className="text-xs text-muted-foreground">
                Comma-separated. Shown as selectable options on the product page.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">
                Size options
              </div>
              <Input
                value={form.size_options}
                onChange={(e) => setField('size_options', e.target.value)}
                placeholder="XS, S, M, L, XL"
              />
              <div className="text-xs text-muted-foreground">Comma-separated.</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Image URL</div>
              <Input
                value={form.image_url}
                onChange={(e) => setField('image_url', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Description</div>
              <Textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </div>

            <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
              <span className="text-sm text-foreground">Active</span>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setField('is_active', e.target.checked)}
              />
            </label>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={() => void save()} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
              {form.id && (
                <Button variant="outline" className="flex-1" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All products</CardTitle>
            <CardDescription>{loading ? 'Loading…' : `${rows.length} items`}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[240px]">
                      <button
                        onClick={() => selectForEdit(r)}
                        className="text-left hover:underline underline-offset-4"
                      >
                        {r.name}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {r.slug ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.category ?? '—'}</TableCell>
                    <TableCell className="text-right">{formatZar(r.price)}</TableCell>
                    <TableCell className="text-right">{r.stock ?? 0}</TableCell>
                    <TableCell>
                      <Badge variant={(r.is_active ?? true) ? 'default' : 'secondary'}>
                        {(r.is_active ?? true) ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => void toggleActive(r)}
                          className="h-8 px-3"
                        >
                          {(r.is_active ?? true) ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => selectForEdit(r)}
                          className="h-8 px-3"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => void remove(r.id)}
                          disabled={deletingId === r.id}
                          className="h-8 px-3"
                        >
                          {deletingId === r.id ? 'Deleting…' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


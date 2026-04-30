'use client'
 
import { useEffect, useState } from 'react'
 import Link from 'next/link'
 
 import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
 import { Button } from '@/components/ui/button'
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
 import { useToast } from '@/components/ui/use-toast'
 
export const dynamic = 'force-dynamic'

 type SubscriberRow = {
   email: string
   source: string
   status: string
   created_at: string
 }
 
 function toCsv(rows: SubscriberRow[]) {
   const header = ['email', 'source', 'status', 'created_at']
   const escape = (v: string) => `"${String(v ?? '').replaceAll('"', '""')}"`
   const lines = [header.join(','), ...rows.map((r) => header.map((k) => escape((r as any)[k])).join(','))]
   return lines.join('\n')
 }
 
 export default function AdminSubscribersPage() {
   const { toast } = useToast()
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)
   const [rows, setRows] = useState<SubscriberRow[]>([])
   const [loading, setLoading] = useState(true)
 
  async function load() {
    if (!supabase) return
     setLoading(true)
     const { data, error } = await supabase
       .from('marketing_subscribers')
       .select('email,source,status,created_at')
       .order('created_at', { ascending: false })
 
     if (error) {
       toast({
         title: 'Failed to load subscribers',
         description: error.message,
         variant: 'destructive',
       })
       setRows([])
     } else {
       setRows((data ?? []) as SubscriberRow[])
     }
 
     setLoading(false)
   }
 
   useEffect(() => {
    setSupabase(createSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
     void load()
  }, [supabase])
 
   async function copyCsv() {
     try {
       await navigator.clipboard.writeText(toCsv(rows))
       toast({ title: 'Copied CSV', description: `${rows.length} rows copied to clipboard.` })
     } catch (e) {
       toast({
         title: 'Copy failed',
         description: e instanceof Error ? e.message : 'Could not copy to clipboard.',
         variant: 'destructive',
       })
     }
   }
 
   return (
     <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
           <h1 className="text-3xl font-light tracking-widest uppercase">Subscribers</h1>
           <p className="mt-2 text-sm text-muted-foreground">
             Emails captured from customer account sign-ups (for marketing).
           </p>
         </div>
         <div className="flex gap-3">
           <Button asChild variant="outline">
             <Link href="/admin">Admin home</Link>
           </Button>
           <Button variant="outline" onClick={() => void load()} disabled={loading}>
             Refresh
           </Button>
           <Button onClick={() => void copyCsv()} disabled={loading || rows.length === 0}>
             Copy CSV
           </Button>
         </div>
       </div>
 
       <Card className="mt-8">
         <CardHeader>
           <CardTitle>Marketing subscribers</CardTitle>
           <CardDescription>{loading ? 'Loading…' : `${rows.length} emails`}</CardDescription>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Email</TableHead>
                 <TableHead>Source</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Created</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {rows.map((r) => (
                 <TableRow key={r.email}>
                   <TableCell className="font-mono text-xs">{r.email}</TableCell>
                   <TableCell className="text-sm text-muted-foreground">{r.source}</TableCell>
                   <TableCell className="text-sm text-muted-foreground">{r.status}</TableCell>
                   <TableCell className="text-sm text-muted-foreground">
                     {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                   </TableCell>
                 </TableRow>
               ))}
               {!loading && rows.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                     No subscribers yet.
                   </TableCell>
                 </TableRow>
               ) : null}
             </TableBody>
           </Table>
         </CardContent>
       </Card>
     </div>
   )
 }


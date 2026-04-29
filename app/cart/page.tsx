 'use client'
 
 import Image from 'next/image'
 import Link from 'next/link'
 import { useEffect, useMemo, useState } from 'react'
 
 import { Minus, Plus, Trash2 } from 'lucide-react'
 
 import type { BagItem } from '@/lib/bag'
 import { clearBag, getBag, onBagChange, removeFromBag, setBagQuantity } from '@/lib/bag'
 import { Button } from '@/components/ui/button'
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
 import { useToast } from '@/hooks/use-toast'
 import { formatZar } from '@/lib/currency'
 
 export default function CartPage() {
   const { toast } = useToast()
   const [items, setItems] = useState<BagItem[]>([])
 
   useEffect(() => {
     const update = () => setItems(getBag())
     update()
     return onBagChange(update)
   }, [])
 
   const subtotal = useMemo(
     () => items.reduce((sum, i) => sum + Number(i.price) * (i.quantity ?? 0), 0),
     [items],
   )
 
   return (
     <div className="min-h-screen bg-background pt-20">
       <section className="py-12 md:py-20">
         <div className="mx-auto max-w-6xl px-6 lg:px-8">
           <div className="mb-10 flex items-end justify-between gap-6">
             <div>
               <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">Cart</h1>
               <p className="mt-2 text-sm text-muted-foreground">
                 {items.length === 0 ? 'Your cart is empty.' : `${items.length} item(s)`}
               </p>
             </div>
             <div className="flex gap-3">
               <Button asChild variant="outline">
                 <Link href="/shop">Continue shopping</Link>
               </Button>
               <Button
                 variant="outline"
                 onClick={() => {
                   clearBag()
                   toast({ title: 'Cart cleared' })
                 }}
                 disabled={items.length === 0}
               >
                 Clear
               </Button>
             </div>
           </div>
 
           {items.length === 0 ? (
             <Card>
               <CardContent className="py-12 text-center text-muted-foreground">
                 Your cart is empty. Browse the shop to add items.
               </CardContent>
             </Card>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-4">
                 {items.map((item) => {
                   const key = { productId: item.productId, color: item.color, size: item.size }
                   const href = item.slug ? `/shop/${item.slug}` : '/shop'
                   return (
                     <Card key={`${item.productId}:${item.color ?? ''}:${item.size ?? ''}`}>
                       <CardContent className="p-5">
                         <div className="flex gap-4">
                           <Link href={href} className="relative h-24 w-20 shrink-0 overflow-hidden bg-secondary">
                             <Image
                               src={item.imageUrl ?? '/images/product-1.jpg'}
                               alt={item.name}
                               fill
                               className="object-cover"
                             />
                           </Link>
 
                           <div className="flex-1">
                             <div className="flex items-start justify-between gap-4">
                               <div>
                                 <Link href={href} className="text-sm font-medium text-foreground hover:underline underline-offset-4">
                                   {item.name}
                                 </Link>
                                 <div className="mt-1 text-xs text-muted-foreground tracking-wider uppercase">
                                   {item.color ? `Color: ${item.color}` : null}
                                   {item.color && item.size ? <span className="mx-2">·</span> : null}
                                   {item.size ? `Size: ${item.size}` : null}
                                 </div>
                               </div>
                               <div className="text-sm text-foreground">{formatZar(item.price)}</div>
                             </div>
 
                             <div className="mt-4 flex items-center justify-between gap-4">
                               <div className="flex items-center gap-2">
                                 <Button
                                   variant="outline"
                                   className="h-9 w-9 p-0"
                                   onClick={() => setBagQuantity(key, (item.quantity ?? 1) - 1)}
                                   aria-label="Decrease quantity"
                                 >
                                   <Minus className="h-4 w-4" />
                                 </Button>
                                 <div className="min-w-10 text-center text-sm text-foreground">
                                   {item.quantity}
                                 </div>
                                 <Button
                                   variant="outline"
                                   className="h-9 w-9 p-0"
                                   onClick={() => setBagQuantity(key, (item.quantity ?? 1) + 1)}
                                   aria-label="Increase quantity"
                                 >
                                   <Plus className="h-4 w-4" />
                                 </Button>
                               </div>
 
                               <div className="flex items-center gap-3">
                                 <div className="text-sm text-muted-foreground">
                                   {formatZar(Number(item.price) * (item.quantity ?? 0))}
                                 </div>
                                 <Button
                                   variant="outline"
                                   className="h-9 px-3"
                                   onClick={() => {
                                     removeFromBag(key)
                                     toast({ title: 'Removed from cart' })
                                   }}
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </div>
                             </div>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   )
                 })}
               </div>
 
               <Card className="h-fit">
                 <CardHeader>
                   <CardTitle>Summary</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground">Subtotal</span>
                     <span className="text-foreground">{formatZar(subtotal)}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground">Shipping</span>
                     <span className="text-foreground">Calculated at checkout</span>
                   </div>
                   <div className="border-t border-border pt-4 flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Total</span>
                     <span className="text-lg text-foreground">{formatZar(subtotal)}</span>
                   </div>
 
                   <Button
                     className="w-full"
                     asChild
                   >
                     <Link href="/checkout">Checkout</Link>
                   </Button>
                 </CardContent>
               </Card>
             </div>
           )}
         </div>
       </section>
     </div>
   )
 }
 

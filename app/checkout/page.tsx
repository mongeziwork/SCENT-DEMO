 'use client'
 
 import { useEffect, useMemo, useState } from 'react'
 import { useRouter } from 'next/navigation'
 
 import { Button } from '@/components/ui/button'
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
 import { Input } from '@/components/ui/input'
 import { Textarea } from '@/components/ui/textarea'
 import { useToast } from '@/hooks/use-toast'
 import type { BagItem } from '@/lib/bag'
 import { getBag } from '@/lib/bag'
 import { formatZar } from '@/lib/currency'

 const DELIVERY_OPTIONS = [
   {
     id: 'courier',
     label: 'Standard nationwide courier',
     description: 'Delivered anywhere in South Africa.',
     fee: 190,
   },
   {
     id: 'collection',
     label: 'Free collection',
     description: 'Collect in Johannesburg, Sandton, Rivonia.',
     fee: 0,
   },
] as const

type DeliveryOptionId = (typeof DELIVERY_OPTIONS)[number]['id']

 type InitResponse = {
   actionUrl: string
   fields: Record<string, string>
   orderId: string
 }
 
 export default function CheckoutPage() {
   const router = useRouter()
   const { toast } = useToast()
 
   const [items, setItems] = useState<BagItem[]>([])
   const [loading, setLoading] = useState(false)
 
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [phone, setPhone] = useState('')
   const [address, setAddress] = useState('')
   const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionId>('courier')
 
   useEffect(() => {
     const bag = getBag()
     setItems(bag)
     if (bag.length === 0) router.replace('/cart')
   }, [router])
 
   const subtotal = useMemo(
     () => items.reduce((sum, i) => sum + Number(i.price) * (i.quantity ?? 0), 0),
     [items],
   )
   const selectedDeliveryOption =
     DELIVERY_OPTIONS.find((option) => option.id === deliveryOption) ?? DELIVERY_OPTIONS[0]
   const total = subtotal + selectedDeliveryOption.fee
 
   async function startPayFast() {
     if (!name.trim() || !email.trim()) {
       toast({
         title: 'Missing details',
         description: 'Name and email are required.',
         variant: 'destructive',
       })
       return
     }
 
     setLoading(true)
     const res = await fetch('/api/payfast/init', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         customer: { name, email, phone, address },
         delivery: {
           method: selectedDeliveryOption.id,
         },
         items: items.map((i) => ({
           productId: i.productId,
           slug: i.slug,
           name: i.name,
           price: i.price,
           imageUrl: i.imageUrl,
           color: i.color,
           size: i.size,
           quantity: i.quantity,
         })),
       }),
     })
 
     const json = (await res.json()) as Partial<InitResponse> & { error?: string }
     if (!res.ok || !json.actionUrl || !json.fields) {
       toast({
         title: 'Checkout failed',
         description: json.error ?? 'Unable to start payment.',
         variant: 'destructive',
       })
       setLoading(false)
       return
     }
 
     // Build and submit PayFast form POST
     const form = document.createElement('form')
     form.method = 'POST'
     form.action = json.actionUrl
 
     for (const [k, v] of Object.entries(json.fields)) {
       const input = document.createElement('input')
       input.type = 'hidden'
       input.name = k
       input.value = v
       form.appendChild(input)
     }
 
     document.body.appendChild(form)
     form.submit()
   }
 
   return (
     <div className="min-h-screen bg-background pt-20">
       <section className="py-12 md:py-20">
         <div className="mx-auto max-w-6xl px-6 lg:px-8">
           <div className="mb-10">
             <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">Checkout</h1>
             <p className="mt-2 text-sm text-muted-foreground">
               Pay securely via PayFast in South African Rand.
             </p>
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="lg:col-span-2">
               <CardHeader>
                 <CardTitle>Customer details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="text-xs tracking-widest uppercase text-muted-foreground">Name</div>
                     <Input value={name} onChange={(e) => setName(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <div className="text-xs tracking-widest uppercase text-muted-foreground">Email</div>
                     <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <div className="text-xs tracking-widest uppercase text-muted-foreground">Phone</div>
                     <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <div className="text-xs tracking-widest uppercase text-muted-foreground">Address</div>
                     <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="text-xs tracking-widest uppercase text-muted-foreground">
                     Delivery notes (optional)
                   </div>
                   <Textarea placeholder="e.g. gate code, preferred delivery time" />
                 </div>
                 <div className="space-y-3">
                   <div className="text-xs tracking-widest uppercase text-muted-foreground">
                     Delivery method
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {DELIVERY_OPTIONS.map((option) => {
                      const isSelected = deliveryOption === option.id

                       return (
                         <Button
                           key={option.id}
                           type="button"
                           variant={isSelected ? 'default' : 'outline'}
                           className="h-auto justify-start p-4 text-left"
                           onClick={() => setDeliveryOption(option.id)}
                         >
                           <span>
                             <span className="block text-sm font-medium">{option.label}</span>
                             <span className="mt-1 block text-xs normal-case tracking-normal opacity-80">
                               {option.description}
                             </span>
                             <span className="mt-2 block text-xs font-medium uppercase tracking-widest">
                               {option.fee === 0 ? 'Free' : formatZar(option.fee)}
                             </span>
                           </span>
                         </Button>
                       )
                     })}
                   </div>
                 </div>
               </CardContent>
             </Card>
 
             <Card className="h-fit">
               <CardHeader>
                 <CardTitle>Order summary</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-muted-foreground">Items</span>
                   <span className="text-foreground">{items.length}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span className="text-foreground">{formatZar(subtotal)}</span>
                 </div>
                 <div className="flex items-center justify-between gap-4 text-sm">
                   <span className="text-muted-foreground">{selectedDeliveryOption.label}</span>
                   <span className="text-foreground">
                     {selectedDeliveryOption.fee === 0 ? 'Free' : formatZar(selectedDeliveryOption.fee)}
                   </span>
                 </div>
                 <div className="border-t border-border pt-4 flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Total</span>
                   <span className="text-lg text-foreground">{formatZar(total)}</span>
                 </div>
                 <Button className="w-full" onClick={() => void startPayFast()} disabled={loading}>
                   {loading ? 'Redirecting…' : 'Pay with PayFast'}
                 </Button>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>
     </div>
   )
 }
 

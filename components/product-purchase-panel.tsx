'use client'

import { useMemo, useState } from 'react'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { addToBag } from '@/lib/bag'

type Props = {
  product: {
    id: string
    name: string
    slug: string | null
    price: string | number
    image_url: string | null
    stock?: number | null
    color_options?: string[] | null
    size_options?: string[] | null
  }
}

function normalize(items: string[] | null | undefined) {
  const cleaned = (items ?? []).map((s) => s.trim()).filter(Boolean)
  return Array.from(new Set(cleaned))
}

export function ProductPurchasePanel({ product }: Props) {
  const { toast } = useToast()

  const colors = useMemo(() => normalize(product.color_options), [product.color_options])
  const sizes = useMemo(() => normalize(product.size_options), [product.size_options])

  const [color, setColor] = useState<string | undefined>(colors[0])
  const [size, setSize] = useState<string | undefined>(sizes[0])

  const requiresColor = colors.length > 0
  const requiresSize = sizes.length > 0

  const inStock = (product.stock ?? 0) > 0
  const canAdd =
    inStock && (!requiresColor || Boolean(color)) && (!requiresSize || Boolean(size))

  return (
    <div className="mt-10">
      {(requiresColor || requiresSize) && (
        <div className="space-y-5">
          {requiresColor && (
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Color</div>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {requiresSize && (
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Size</div>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <motion.button
          disabled={!canAdd}
          onClick={() => {
            if (!canAdd) {
              toast({
                title: inStock ? 'Select options' : 'Unavailable',
                description: inStock
                  ? 'Please choose an available size and color.'
                  : 'This item is currently out of stock.',
                variant: 'destructive',
              })
              return
            }

            addToBag({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
              imageUrl: product.image_url ?? null,
              color: color ?? null,
              size: size ?? null,
            })

            toast({
              title: 'Added to bag',
              description: `${product.name}${color ? ` · ${color}` : ''}${size ? ` · ${size}` : ''}`,
            })
          }}
          whileHover={canAdd ? { scale: 1.01 } : undefined}
          whileTap={canAdd ? { scale: 0.99 } : undefined}
          className="flex-1 py-4 bg-foreground text-background text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <ShoppingBag className="h-4 w-4" />
          {inStock ? 'Add to Bag' : 'Out of Stock'}
        </motion.button>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

type ProductImageGalleryProps = {
  images: string[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const selectedImage = images[selectedIndex] ?? images[0]

  function openImage(index: number) {
    setSelectedIndex(index)
    setIsOpen(true)
  }

  function move(direction: -1 | 1) {
    setSelectedIndex((current) => {
      const next = current + direction
      if (next < 0) return images.length - 1
      if (next >= images.length) return 0
      return next
    })
  }

  if (images.length === 0) return null

  return (
    <>
      <div className="space-y-3">
        <div className="relative overflow-hidden bg-secondary">
          <button
            type="button"
            onClick={() => openImage(selectedIndex)}
            className="group relative block aspect-[3/4] w-full overflow-hidden text-left"
          >
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={`${productName} image ${selectedIndex + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
            )}
            <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3 w-3" />
              View larger
            </span>
          </button>

          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 p-0"
                onClick={() => move(-1)}
                aria-label="Previous product image"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 p-0"
                onClick={() => move(1)}
                aria-label="Next product image"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-dot-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`Show product image ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      selectedIndex === index ? 'w-7 bg-foreground' : 'w-1.5 bg-foreground/35'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-thumb-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-24 w-20 shrink-0 overflow-hidden border bg-secondary ${
                  selectedIndex === index ? 'border-foreground' : 'border-border'
                }`}
                aria-label={`Show product image ${index + 1}`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
        <p className="text-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Slide through product images or tap to view larger
        </p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[min(96vw,1200px)] border-border bg-background/95 p-3 sm:p-6" showCloseButton>
          <DialogTitle className="sr-only">{productName} image viewer</DialogTitle>
          <div className="relative h-[78vh] overflow-hidden bg-secondary">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={`${productName} enlarged image ${selectedIndex + 1}`}
                fill
                sizes="96vw"
                className="object-contain p-4"
                priority
              />
            )}

            {images.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full p-0 bg-background/80"
                  onClick={() => move(-1)}
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full p-0 bg-background/80"
                  onClick={() => move(1)}
                  aria-label="Next image"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-thumb-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-20 w-16 shrink-0 overflow-hidden border bg-secondary ${
                    selectedIndex === index ? 'border-foreground' : 'border-border'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

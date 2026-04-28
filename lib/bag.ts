export type BagItem = {
  productId: string
  slug: string | null
  name: string
  price: number
  imageUrl: string | null
  color: string | null
  size: string | null
  quantity: number
}

const STORAGE_KEY = 'scent:bag:v1'
const EVENT_NAME = 'scent:bag'

function safeParse(json: string | null): unknown {
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getBag(): BagItem[] {
  if (typeof window === 'undefined') return []
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY))
  if (!Array.isArray(parsed)) return []
  return parsed as BagItem[]
}

function writeBag(next: BagItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function getBagCount(): number {
  return getBag().reduce((sum, item) => sum + (item.quantity ?? 0), 0)
}

export function clearBag() {
  if (typeof window === 'undefined') return
  writeBag([])
}

export function setBagQuantity(
  key: Pick<BagItem, 'productId' | 'color' | 'size'>,
  quantity: number,
) {
  if (typeof window === 'undefined') return
  const q = Math.max(0, Math.floor(quantity))
  const current = getBag()
  const next = current
    .map((x) => {
      if (
        x.productId !== key.productId ||
        (x.color ?? null) !== (key.color ?? null) ||
        (x.size ?? null) !== (key.size ?? null)
      ) {
        return x
      }
      return { ...x, quantity: q }
    })
    .filter((x) => (x.quantity ?? 0) > 0)
  writeBag(next)
}

export function removeFromBag(key: Pick<BagItem, 'productId' | 'color' | 'size'>) {
  return setBagQuantity(key, 0)
}

export function addToBag(item: Omit<BagItem, 'quantity'> & { quantity?: number }) {
  if (typeof window === 'undefined') return

  const qty = Math.max(1, Math.floor(item.quantity ?? 1))
  const current = getBag()

  const idx = current.findIndex(
    (x) =>
      x.productId === item.productId &&
      (x.color ?? null) === (item.color ?? null) &&
      (x.size ?? null) === (item.size ?? null),
  )

  if (idx >= 0) {
    const existing = current[idx]!
    const next = current.slice()
    next[idx] = { ...existing, quantity: (existing.quantity ?? 0) + qty }
    writeBag(next)
    return
  }

  writeBag([
    {
      ...item,
      quantity: qty,
    },
    ...current,
  ])
}

export function onBagChange(handler: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT_NAME, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(EVENT_NAME, handler)
    window.removeEventListener('storage', handler)
  }
}


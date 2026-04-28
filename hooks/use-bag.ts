'use client'

import { useEffect, useState } from 'react'

import { getBagCount, onBagChange } from '@/lib/bag'

export function useBagCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => setCount(getBagCount())
    update()
    return onBagChange(update)
  }, [])

  return count
}


"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { getProduct, type Product } from "@/lib/products"

type CartLine = { id: number; qty: number }
type DetailedLine = Product & { qty: number }

type CartContextValue = {
  lines: CartLine[]
  detailed: DetailedLine[]
  count: number
  subtotal: number
  add: (id: number) => void
  setQty: (id: number, qty: number) => void
  remove: (id: number) => void
  clear: () => void
  isOpen: boolean
  open: () => void
  close: () => void
  toast: { id: number; message: string } | null
  notify: (message: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "nandani-bag-v1"
const MAX_QTY = 20

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState<CartContextValue["toast"]>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[]
        setLines(parsed.filter((l) => getProduct(l.id) && l.qty > 0).map((l) => ({ id: l.id, qty: Math.min(l.qty, MAX_QTY) })))
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const notify = useCallback((message: string) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }, [])

  const add = useCallback((id: number) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id)
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l))
      return [...prev, { id, qty: 1 }]
    })
  }, [])

  const setQty = useCallback((id: number, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, MAX_QTY) } : l)),
    )
  }, [])

  const remove = useCallback((id: number) => setLines((prev) => prev.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines.flatMap((l) => {
      const p = getProduct(l.id)
      return p ? [{ ...p, qty: l.qty }] : []
    })
    return {
      lines,
      detailed,
      count: detailed.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((n, l) => n + l.price * l.qty, 0),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open,
      close,
      toast,
      notify,
    }
  }, [lines, add, setQty, remove, clear, isOpen, open, close, toast, notify])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}

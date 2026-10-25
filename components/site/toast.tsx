"use client"

import { AnimatePresence, motion } from "motion/react"
import { Heart } from "lucide-react"
import { useCart } from "./cart-provider"

export function Toast() {
  const { toast } = useCart()
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="glass-strong flex items-center gap-2.5 rounded-full px-5 py-3 text-sm"
          >
            <Heart className="size-4 fill-primary text-primary" aria-hidden="true" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

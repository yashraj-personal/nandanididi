"use client"

import { motion, useMotionValue, useSpring } from "motion/react"
import { useRef } from "react"
import { cn } from "@/lib/utils"

export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 250, damping: 15, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
      <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" aria-hidden="true" />
      {children}
    </p>
  )
}

export const primaryButton =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary via-[#f9b9ac] to-accent px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_-12px_rgba(245,163,183,0.9)] transition-[transform,box-shadow] hover:shadow-[0_16px_50px_-10px_rgba(245,163,183,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"

export const glassButton =
  "glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-white/10 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2"

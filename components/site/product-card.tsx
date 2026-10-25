"use client"

import Image from "next/image"
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react"
import { Check, Heart, Plus } from "lucide-react"
import { useRef, useState } from "react"
import { formatINR, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { useCart } from "./cart-provider"

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add, notify } = useCart()
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 })

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  const handleAdd = () => {
    add(product.id)
    notify(`${product.name} added to your bag ♡`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !cardRef.current) return
          const r = cardRef.current.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          ry.set((px - 0.5) * 12)
          rx.set((0.5 - py) * 12)
          cardRef.current.style.setProperty("--gx", `${px * 100}%`)
          cardRef.current.style.setProperty("--gy", `${py * 100}%`)
        }}
        onPointerLeave={() => {
          rx.set(0)
          ry.set(0)
        }}
        className="glass group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-2.5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(380px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.16), transparent 45%)",
          }}
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
          {product.tag && (
            <span className="glass absolute left-2.5 top-2.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
              {product.tag}
            </span>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={() => setLiked((v) => !v)}
            aria-pressed={liked}
            aria-label={liked ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
            className="glass absolute right-2.5 top-2.5 z-20 grid size-9 place-items-center rounded-full"
          >
            <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
              <Heart className={cn("size-4", liked ? "fill-primary text-primary" : "text-foreground")} aria-hidden="true" />
            </motion.span>
          </motion.button>
          {discount > 0 && (
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
              {discount}% off
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-4" style={{ transform: "translateZ(30px)" }}>
          <p className="text-[10px] uppercase tracking-[0.18em] text-primary">{product.category}</p>
          <h3 className="mt-1.5 font-serif text-lg leading-snug">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-4">
            <p className="font-semibold">
              {formatINR(product.price)}
              {product.oldPrice && (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">
                  {formatINR(product.oldPrice)}
                </span>
              )}
            </p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to bag`}
              className={cn(
                "relative z-20 inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-full px-4 text-xs font-semibold transition-colors",
                added ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-accent",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? "added" : "add"}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  className="inline-flex items-center gap-1.5"
                >
                  {added ? <Check className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
                  {added ? "Added" : "Add"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

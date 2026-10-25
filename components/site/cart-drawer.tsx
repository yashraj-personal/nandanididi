"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Heart, Loader2, Minus, PartyPopper, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { formatINR } from "@/lib/products"
import { whatsappUrl } from "@/lib/site"
import { useCart } from "./cart-provider"
import { primaryButton } from "./motion-helpers"

type Step = "bag" | "details" | "done"
type PlacedOrder = {
  id: string
  customerName: string
  subtotal: number
  totalQty: number
  lines: { name: string; qty: number; lineTotal: number }[]
}

const inputClass =
  "h-12 w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/70 focus:bg-white/[0.09]"

export function CartDrawer() {
  const { isOpen, close, detailed, lines, subtotal, count, setQty, remove, clear } = useCart()
  const [step, setStep] = useState<Step>("bag")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<PlacedOrder | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen, close])

  const handleClose = () => {
    close()
    if (step === "done") {
      setTimeout(() => {
        setStep("bag")
        setOrder(null)
      }, 400)
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? "")
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: get("name"),
            phone: get("phone"),
            email: get("email"),
            address: get("address"),
            city: get("city"),
            pincode: get("pincode"),
            notes: get("notes"),
          },
          items: lines,
          website: get("website"),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Could not place your order")
      setOrder(data.order)
      clear()
      setStep("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order")
    } finally {
      setSubmitting(false)
    }
  }

  const orderMessage = order
    ? `Hi Nandani! I just placed an order on your website ♡\n\nOrder ID: ${order.id}\n\n${order.lines
        .map((l) => `• ${l.name} x ${l.qty} — ${formatINR(l.lineTotal)}`)
        .join("\n")}\n\nSubtotal: ${formatINR(order.subtotal)}\n\nPlease confirm availability, delivery charges and payment details.`
    : ""

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="glass-strong fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col sm:inset-y-3 sm:right-3 sm:rounded-[2rem]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2">
                {step === "details" && (
                  <button
                    type="button"
                    onClick={() => setStep("bag")}
                    aria-label="Back to bag"
                    className="grid size-9 place-items-center rounded-full hover:bg-white/10"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </button>
                )}
                <h2 id="bag-title" className="font-serif text-2xl">
                  {step === "bag" ? "Your little bag" : step === "details" ? "Delivery details" : "Order placed"}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                aria-label="Close bag"
                className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === "bag" && (
                <motion.div
                  key="bag"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {detailed.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <span className="glass grid size-20 place-items-center rounded-full">
                          <ShoppingBag className="size-8 text-primary" aria-hidden="true" />
                        </span>
                        <p className="mt-5 font-serif text-xl">Your bag is waiting</p>
                        <p className="mt-2 max-w-xs text-sm text-muted-foreground">Add a handmade favourite to get started.</p>
                        <a href="#shop" onClick={handleClose} className={`${primaryButton} mt-6`}>
                          Browse gifts
                        </a>
                      </div>
                    ) : (
                      <ul className="grid gap-3">
                        <AnimatePresence initial={false}>
                          {detailed.map((item) => (
                            <motion.li
                              key={item.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 40 }}
                              className="glass flex gap-3 rounded-2xl p-2.5"
                            >
                              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="80px" className="object-cover" />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-serif leading-tight">{item.name}</p>
                                  <button
                                    type="button"
                                    onClick={() => remove(item.id)}
                                    aria-label={`Remove ${item.name}`}
                                    className="text-muted-foreground transition-colors hover:text-destructive"
                                  >
                                    <Trash2 className="size-4" aria-hidden="true" />
                                  </button>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">{formatINR(item.price)} each</p>
                                <div className="mt-auto flex items-center justify-between pt-2">
                                  <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                                    <button
                                      type="button"
                                      onClick={() => setQty(item.id, item.qty - 1)}
                                      aria-label={`Decrease quantity of ${item.name}`}
                                      className="grid size-7 place-items-center rounded-full hover:bg-white/15"
                                    >
                                      <Minus className="size-3" aria-hidden="true" />
                                    </button>
                                    <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
                                    <button
                                      type="button"
                                      onClick={() => setQty(item.id, item.qty + 1)}
                                      aria-label={`Increase quantity of ${item.name}`}
                                      className="grid size-7 place-items-center rounded-full hover:bg-white/15"
                                    >
                                      <Plus className="size-3" aria-hidden="true" />
                                    </button>
                                  </div>
                                  <p className="text-sm font-semibold">{formatINR(item.price * item.qty)}</p>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </div>
                  {detailed.length > 0 && (
                    <div className="border-t border-white/10 px-6 py-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subtotal · {count} {count === 1 ? "item" : "items"}
                        </span>
                        <span className="font-serif text-2xl">{formatINR(subtotal)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Delivery charges confirmed on WhatsApp.</p>
                      <button type="button" onClick={() => setStep("details")} className={`${primaryButton} mt-4 w-full`}>
                        Continue to checkout
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === "details" && (
                <motion.form
                  key="details"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="grid flex-1 content-start gap-3 overflow-y-auto px-6 py-5">
                    <Field label="Full name">
                      <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={inputClass} placeholder="Your name" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Phone / WhatsApp">
                        <input name="phone" required type="tel" inputMode="tel" pattern="\+?[0-9\s\-]{10,16}" autoComplete="tel" className={inputClass} placeholder="98xxxxxxxx" />
                      </Field>
                      <Field label="Email (optional)">
                        <input name="email" type="email" autoComplete="email" className={inputClass} placeholder="you@mail.com" />
                      </Field>
                    </div>
                    <Field label="Address">
                      <textarea
                        name="address"
                        required
                        minLength={5}
                        maxLength={300}
                        rows={2}
                        autoComplete="street-address"
                        className={`${inputClass} h-auto resize-none py-3`}
                        placeholder="House no, street, area"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="City">
                        <input name="city" required autoComplete="address-level2" className={inputClass} placeholder="City" />
                      </Field>
                      <Field label="Pincode">
                        <input name="pincode" required inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} autoComplete="postal-code" className={inputClass} placeholder="6 digits" />
                      </Field>
                    </div>
                    <Field label="Gift note or personalization (optional)">
                      <textarea name="notes" maxLength={500} rows={3} className={`${inputClass} h-auto resize-none py-3`} placeholder="Names, colours, a little message…" />
                    </Field>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                    {error && (
                      <p role="alert" className="rounded-2xl bg-destructive/15 px-4 py-3 text-sm text-destructive">
                        {error}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-white/10 px-6 py-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Order total</span>
                      <span className="font-serif text-2xl">{formatINR(subtotal)}</span>
                    </div>
                    <button type="submit" disabled={submitting || lines.length === 0} className={`${primaryButton} mt-4 w-full`}>
                      {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                      {submitting ? "Placing your order…" : "Place order"}
                    </button>
                  </div>
                </motion.form>
              )}

              {step === "done" && order && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center"
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="absolute text-primary"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: Math.cos((i / 14) * Math.PI * 2) * 160,
                        y: Math.sin((i / 14) * Math.PI * 2) * 160 - 60,
                        opacity: 0,
                        scale: 1,
                      }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                    >
                      <Heart className="size-5 fill-current" />
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14 }}
                    className="grid size-20 place-items-center rounded-full bg-linear-to-br from-primary to-accent text-primary-foreground"
                  >
                    <PartyPopper className="size-9" aria-hidden="true" />
                  </motion.span>
                  <p className="mt-6 font-serif text-3xl">Thank you, {order.customerName.split(" ")[0]}!</p>
                  <p className="mt-2 text-sm text-muted-foreground">Your order has been received.</p>
                  <p className="glass mt-5 rounded-full px-5 py-2 font-mono text-sm tracking-wider">{order.id}</p>
                  <p className="mt-5 max-w-xs text-pretty text-sm text-muted-foreground">
                    Send it on WhatsApp so Nandani can confirm delivery charges and payment details.
                  </p>
                  <a href={whatsappUrl(orderMessage)} target="_blank" rel="noopener noreferrer" className={`${primaryButton} mt-6 w-full`}>
                    Confirm on WhatsApp
                  </a>
                  <button type="button" onClick={handleClose} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
                    Continue browsing
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="px-1 text-xs font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  )
}

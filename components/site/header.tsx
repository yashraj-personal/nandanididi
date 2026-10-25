"use client"

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react"
import { Heart, Menu, ShoppingBag, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "./cart-provider"

const links = [
  { href: "#home", label: "Home" },
  { href: "#shop", label: "Shop" },
  { href: "#story", label: "Story" },
  { href: "#custom", label: "Custom" },
  { href: "#contact", label: "Contact" },
  { href: "/support", label: "Support" },
]

export function Header({ homePrefix = "" }: { homePrefix?: string }) {
  const { count, open } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const getHref = (href: string) => (href.startsWith("#") ? `${homePrefix}${href}` : href)

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40))

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-linear-to-r from-accent via-primary to-lavender"
        style={{ scaleX: progress }}
      />
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <motion.nav
          aria-label="Main navigation"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-3 py-2.5 transition-[padding,background-color] duration-500 md:px-4",
            scrolled && "bg-white/[0.08] py-2",
          )}
        >
          <Link href={`${homePrefix}#home`} className="flex items-center gap-2.5 pl-1" aria-label="Nandani home">
            <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-primary to-lavender font-serif text-xl italic text-primary-foreground shadow-[0_0_24px_-4px_var(--primary)]">
              N
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-lg tracking-wide">Nandani</span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Handmade Gifts</span>
            </span>
          </Link>

          <ul className="hidden items-center lg:flex" onPointerLeave={() => setHovered(null)}>
            {links.map((link) => {
              const isSupportLink = link.href === "/support"

              return (
                <li key={link.href} className="relative">
                  <Link
                    href={getHref(link.href)}
                    onPointerEnter={() => setHovered(link.href)}
                    aria-current={isSupportLink && homePrefix === "/" ? "page" : undefined}
                    className={cn(
                      "relative z-10 px-4 py-2 text-sm transition-colors",
                      isSupportLink
                        ? "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 font-medium text-primary shadow-[0_0_24px_-14px_var(--primary)] hover:bg-primary/15"
                        : "block text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {isSupportLink && (
                      <motion.span
                        aria-hidden="true"
                        animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.18, 1] }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 1.45, repeat: Infinity, ease: "easeInOut" }
                        }
                      >
                        <Heart className="size-3.5 fill-current" aria-hidden="true" />
                      </motion.span>
                    )}
                    <span>{link.label}</span>
                    {isSupportLink && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full border border-primary/40"
                        animate={
                          reduceMotion
                            ? { opacity: 0.55, scale: 1 }
                            : { opacity: [0.35, 0.8, 0.35], scale: [1, 1.035, 1] }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                        }
                      />
                    )}
                  </Link>
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={open}
              aria-label={`Open bag, ${count} items`}
              className="relative grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              className="grid size-11 place-items-center rounded-full bg-white/10 lg:hidden"
            >
              {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="glass-strong mx-auto mt-3 flex max-w-6xl flex-col rounded-3xl p-3 lg:hidden"
            >
              {links.map((link, i) => {
                const isSupportLink = link.href === "/support"

                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={getHref(link.href)}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isSupportLink && homePrefix === "/" ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl px-4 py-3 font-serif text-xl hover:bg-white/10",
                        isSupportLink && "flex items-center justify-between border border-primary/30 bg-primary/10 text-primary",
                      )}
                    >
                      <span>{link.label}</span>
                      {isSupportLink && (
                        <motion.span
                          aria-hidden="true"
                          animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.18, 1] }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { duration: 1.45, repeat: Infinity, ease: "easeInOut" }
                          }
                        >
                          <Heart className="size-4 fill-current" aria-hidden="true" />
                        </motion.span>
                      )}
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

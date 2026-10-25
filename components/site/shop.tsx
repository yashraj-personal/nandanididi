"use client"

import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, Search } from "lucide-react"
import { useDeferredValue, useMemo, useState } from "react"
import { categories, products, type Category } from "@/lib/products"
import { cn } from "@/lib/utils"
import { Reveal, SectionKicker, glassButton } from "./motion-helpers"
import { ProductCard } from "./product-card"

const filters: { value: "All" | Category; label: string }[] = [
  { value: "All", label: "All pieces" },
  ...categories.map((c) => ({ value: c, label: c === "Gifts" ? "Gift sets" : c })),
]

type Sort = "featured" | "low" | "high"

export function Shop() {
  const [active, setActive] = useState<"All" | Category>("All")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>("featured")
  const deferredQuery = useDeferredValue(query)

  const list = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const filtered = products.filter(
      (p) =>
        (active === "All" || p.category === active) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    )
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [active, deferredQuery, sort])

  return (
    <section id="shop" className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionKicker>The little things shop</SectionKicker>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-tight md:text-6xl">
            Find your kind of <em className="text-gradient">lovely.</em>
          </h2>
        </div>
        <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Made for birthdays, best friends, little celebrations — or simply because someone deserves a smile.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter by category" className="glass flex w-full gap-1 overflow-x-auto rounded-full p-1.5 lg:w-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active === f.value}
              onClick={() => setActive(f.value)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors",
                active === f.value ? "text-primary-foreground" : "text-foreground/75 hover:text-foreground",
              )}
            >
              {active === f.value && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-primary to-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <label className="glass flex flex-1 items-center gap-2 rounded-full px-4 lg:w-60 lg:flex-none">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gifts…"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="glass flex items-center rounded-full px-2">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-11 cursor-pointer bg-transparent px-2 text-sm outline-none [&>option]:bg-popover"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
      </Reveal>

      <motion.div layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <p className="glass mt-6 rounded-3xl p-10 text-center text-sm text-muted-foreground">
          No products found. Try another search or category.
        </p>
      )}

      <Reveal className="mt-12 text-center">
        <a href="#custom" className={glassButton}>
          {"Can't find it? Request a custom piece"}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  )
}

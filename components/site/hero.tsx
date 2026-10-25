"use client"

import Image from "next/image"
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"
import { ArrowUpRight, Heart, MousePointerClick, Sparkles, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { Magnetic, glassButton, primaryButton } from "./motion-helpers"
import { useCart } from "./cart-provider"

const NAME = "Nandani".split("")
const WORDS = ["birthdays", "besties", "anniversaries", "little moments", "you"]
const EASE = [0.22, 1, 0.36, 1] as const

type Burst = { id: number; hearts: { angle: number; dist: number; size: number; rotate: number }[] }

export function Hero() {
  const { notify } = useCart()
  const reduceMotion = useReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)
  const [bursts, setBursts] = useState<Burst[]>([])
  const [discovered, setDiscovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })
  const imgX = useTransform(smx, (v) => v * -18)
  const imgY = useTransform(smy, (v) => v * -18)
  const cardX = useTransform(smx, (v) => v * 30)
  const cardY = useTransform(smy, (v) => v * 30)

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2400)
    return () => clearInterval(id)
  }, [])

  const sendLove = () => {
    const id = Date.now()
    const hearts = Array.from({ length: 16 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 16 + Math.random() * 0.3,
      dist: 90 + Math.random() * 120,
      size: 12 + Math.random() * 16,
      rotate: (Math.random() - 0.5) * 90,
    }))
    setBursts((b) => [...b, { id, hearts }])
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1400)
    if (!discovered) {
      setDiscovered(true)
      notify("Nandani sends you a little love ♡")
    }
  }

  return (
    <section
      id="home"
      className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-14 px-5 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        mx.set(e.clientX / window.innerWidth - 0.5)
        my.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      <div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/85"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Custom orders are open
        </motion.p>

        <h1 className="relative mt-6 font-serif font-normal leading-[0.9] tracking-tight">
          <span className="sr-only">Nandani — handmade gifts</span>
          <button
            type="button"
            onClick={sendLove}
            aria-label="Send a little love"
            className="relative block cursor-pointer select-none text-[clamp(4.5rem,13vw,9.5rem)] focus-visible:outline-none"
          >
            <span aria-hidden="true" className="flex">
              {NAME.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block italic"
                  initial={{ y: "70%", opacity: 0, rotate: -14, filter: "blur(14px)" }}
                  animate={{ y: 0, opacity: 1, rotate: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.09, ease: EASE }}
                  whileHover={{ y: -16, rotate: i % 2 ? 8 : -8, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                >
                  <motion.span
                    className="text-shimmer inline-block"
                    animate={
                      reduceMotion
                        ? { y: 0, rotate: 0 }
                        : { y: [0, -3, 0, 2, 0], rotate: [0, 3, -2, 1, 0] }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 1.1,
                            delay: 1.1 + i * 0.08,
                            repeat: Infinity,
                            repeatDelay: 1.45,
                            ease: "easeInOut",
                          }
                    }
                  >
                    {letter}
                  </motion.span>
                </motion.span>
              ))}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 400 30"
              className="absolute -bottom-3 left-1 w-[75%] text-primary"
              fill="none"
            >
              <motion.path
                d="M4 20 C 80 4, 160 28, 240 14 S 360 6, 396 18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 1.1, ease: "easeInOut" }}
              />
            </svg>
            <span aria-hidden="true" className="pointer-events-none absolute left-1/3 top-1/2">
              {bursts.map((burst) =>
                burst.hearts.map((h, i) => (
                  <motion.span
                    key={`${burst.id}-${i}`}
                    className="absolute text-primary"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(h.angle) * h.dist,
                      y: Math.sin(h.angle) * h.dist,
                      scale: 1,
                      opacity: 0,
                      rotate: h.rotate,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    <Heart className="fill-current" style={{ width: h.size, height: h.size }} />
                  </motion.span>
                )),
              )}
            </span>
          </button>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
            className="mt-6 block text-[clamp(2rem,4.6vw,3.4rem)] leading-tight text-foreground"
          >
            Little things. <em className="text-gradient">Big feelings.</em>
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
        >
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Thoughtful handmade gifts and personalized keepsakes, made for{" "}
            <span className="relative inline-flex min-w-[9ch] overflow-hidden align-bottom font-medium text-foreground">
              <AnimatePresence mode="wait">
                <motion.span
                  key={WORDS[wordIndex]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="inline-block"
                >
                  {WORDS[wordIndex]}.
                </motion.span>
              </AnimatePresence>
            </span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#shop" className={primaryButton}>
                Explore the collection
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#custom" className={glassButton}>
                <Sparkles className="size-4 text-accent" aria-hidden="true" />
                Make it personal
              </a>
            </Magnetic>
          </div>

          <div className="mt-9 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex text-accent" aria-label="Five stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
              ))}
            </span>
            Handcrafted in small batches · Made in India
          </div>

          <AnimatePresence>
            {!discovered && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: 2.4 }}
                className="mt-5 inline-flex items-center gap-1.5 text-xs italic text-primary/80"
              >
                <MousePointerClick className="size-3.5" aria-hidden="true" />
                psst… tap her name
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
        className="relative mx-auto w-full max-w-md lg:max-w-none"
      >
        <motion.div style={{ x: imgX, y: imgY }} className="glass relative ml-auto w-[86%] rounded-t-full rounded-b-[2.5rem] p-2.5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem]">
            <Image
              src="/nandanididi/images/hero.png"
              alt="A handmade gift box wrapped in blush pink paper with ribbon and dried flowers"
              fill
              priority
              sizes="(min-width: 1024px) 460px, 86vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/50 via-transparent to-transparent" />
          </div>
        </motion.div>

        <motion.div
          style={{ x: cardX, y: cardY }}
          className="glass absolute bottom-8 left-0 w-48 rounded-3xl p-3 sm:w-56"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/nandanididi/images/resin-charm.png" alt="" fill sizes="224px" className="object-cover" />
          </div>
          <p className="mt-3 font-serif text-lg leading-tight">A gift that feels like you</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Personalized · Thoughtful · Handmade</p>
        </motion.div>

        <motion.div
          style={{ x: cardX, y: cardY }}
          className="absolute right-0 top-4 grid size-28 place-items-center sm:size-32"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_18s_linear_infinite] text-foreground/80">
            <defs>
              <path id="stamp-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text fontSize="9" letterSpacing="2.6" fill="currentColor">
              <textPath href="#stamp-circle">HANDMADE WITH LOVE • SINCE DAY ONE • </textPath>
            </text>
          </svg>
          <span className="glass grid size-14 place-items-center rounded-full">
            <Heart className="size-6 fill-primary text-primary" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

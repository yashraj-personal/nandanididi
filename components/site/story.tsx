"use client"

import Image from "next/image"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { useRef } from "react"
import { Reveal, SectionKicker } from "./motion-helpers"

const QUOTE =
  "Nandani is built around a simple thought: the smallest things can carry the biggest meaning. Every piece is chosen, made and packed with care — so your gift feels personal, never ordinary."

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}

export function Story() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const { scrollYProgress: textProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.45"] })
  const imageY = useTransform(scrollYProgress, [0, 1], [-60, 60])
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-3, 3])
  const words = QUOTE.split(" ")

  return (
    <section id="story" ref={sectionRef} className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div style={{ y: imageY, rotate: imageRotate }} className="glass relative mx-auto w-full max-w-sm rounded-[2.5rem] p-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
            <Image
              src="/nandanididi/images/studio.png"
              alt="Hands crafting handmade gifts at a cozy studio desk"
              fill
              sizes="(min-width: 1024px) 380px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="glass absolute -bottom-6 -right-4 rounded-2xl px-5 py-3 md:-right-10">
            <p className="font-serif text-3xl italic text-gradient">100%</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Made by hand</p>
          </div>
        </motion.div>

        <div>
          <Reveal>
            <SectionKicker>A little about us</SectionKicker>
            <h2 className="mt-5 text-balance font-serif text-4xl leading-tight md:text-6xl">
              Not just a gift. <em className="text-gradient">A little piece of heart.</em>
            </h2>
          </Reveal>
          <p ref={textRef} className="mt-8 text-pretty font-serif text-xl leading-relaxed md:text-2xl">
            {words.map((word, i) => (
              <Word key={i} progress={textProgress} range={[i / words.length, (i + 1) / words.length]}>
                {word}
              </Word>
            ))}
          </p>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
              {"From tiny keychains to thoughtful custom creations, we're here to help you celebrate people, memories and moments in your own way."}
            </p>
            <p className="mt-8 font-serif text-3xl italic text-primary">With love, Nandani ♡</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

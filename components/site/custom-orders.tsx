"use client"

import { motion } from "motion/react"
import { ArrowUpRight, MessageCircleHeart, Palette, PackageCheck } from "lucide-react"
import { whatsappUrl } from "@/lib/site"
import { Magnetic, Reveal, SectionKicker, primaryButton } from "./motion-helpers"

const steps = [
  { icon: MessageCircleHeart, title: "Share your idea", text: "Tell us the name, colour, theme or occasion you have in mind." },
  { icon: Palette, title: "Confirm the details", text: "We'll discuss design, pricing and delivery before starting." },
  { icon: PackageCheck, title: "Made just for you", text: "Your handmade piece is prepared with care and packed for gifting." },
]

export function CustomOrders() {
  return (
    <section id="custom" className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center md:px-14 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
        />
        <Reveal className="relative">
          <SectionKicker>Your idea, our hands</SectionKicker>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            {"Dream it. We'll make it "}
            <em className="text-gradient">personal.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
            {"Have a name, colour, favourite quote or special idea in mind? Tell us what you're imagining and we'll help you create a keepsake that's uniquely yours."}
          </p>
          <div className="mt-8">
            <Magnetic>
              <a
                href={whatsappUrl("Hi Nandani! I'd like to ask about a custom handmade gift. My idea is: ")}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButton}
              >
                Start a custom order
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <ol className="relative mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="glass rounded-3xl p-6 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-primary/30 to-lavender/30">
                  <step.icon className="size-5 text-primary" aria-hidden="true" />
                </span>
                <span className="font-serif text-4xl italic text-outline">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-serif text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

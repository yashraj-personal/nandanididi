import Image from "next/image"
import type { Metadata } from "next"
import { ArrowUpRight, Heart, ScanLine } from "lucide-react"
import { SectionKicker, primaryButton } from "@/components/site/motion-helpers"
import { SiteShell } from "@/components/site/site-shell"

const UPI_PAYMENT_LINK = "upi://pay?pa=nandaniprakash20@oksbi&pn=Nandani%20Prakash&cu=INR"
const SUPPORT_QR_SOURCE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qr-code%20%283%29-Y0Vf3MGZKeT8IRoEQmTb3ARJ4xOVcB.png"
const UPI_ID = "nandaniprakash20@oksbi"

export const metadata: Metadata = {
  title: "Support Nandani | Nandani Handmade Gifts",
  description: "Support Nandani Prakash and her handmade gifts through UPI. Scan the heart QR code or open your UPI app.",
}

export default function SupportPage() {
  return (
    <SiteShell homePrefix="/">
      <main className="relative z-10">
        <section
          id="support"
          aria-labelledby="support-heading"
          className="mx-auto grid min-h-svh max-w-6xl items-center gap-10 px-5 pb-20 pt-36 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:pb-24 lg:pt-32"
        >
          <div className="max-w-xl">
            <SectionKicker>Support the maker</SectionKicker>
            <h1 id="support-heading" className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              A little heart goes a long way.
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              If you&apos;d like to support Nandani&apos;s handmade work, you can send a contribution directly through UPI. Every bit helps keep the studio full of color, care, and new little creations.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <Heart className="size-5 fill-current" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-foreground">Nandani Prakash</p>
                <p className="mt-1 break-all text-sm text-muted-foreground">{UPI_ID}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col items-start gap-4">
              <a href={UPI_PAYMENT_LINK} className={primaryButton} aria-label="Open UPI payment for Nandani Prakash">
                <Heart className="size-4 fill-current" aria-hidden="true" />
                Open UPI app
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                On a phone, this opens your UPI app. On desktop, scan the QR code with your mobile UPI app.
              </p>
            </div>
          </div>

          <article className="glass mx-auto w-full max-w-md rounded-[2.5rem] p-5 sm:p-7">
            <div className="rounded-3xl bg-white p-3 sm:p-4">
              <Image
                src={SUPPORT_QR_SOURCE}
                alt="Heart-shaped UPI QR code for Nandani Prakash"
                width={1600}
                height={1600}
                preload
                unoptimized
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 380px, 88vw"
                className="block h-auto w-full"
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Scan to support</p>
                <p className="mt-1 text-sm text-muted-foreground">Nandani Prakash · UPI · INR</p>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <ScanLine className="size-5" aria-hidden="true" />
              </span>
            </div>
            <span
              aria-hidden="true"
              className="support-portal-pulse pointer-events-none absolute inset-0 rounded-[2.5rem] border border-primary/40"
            />
          </article>
        </section>
      </main>
    </SiteShell>
  )
}

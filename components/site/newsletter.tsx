"use client"

import { ArrowRight, Loader2, Mail as MailHeart } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useCart } from "./cart-provider"
import { Reveal } from "./motion-helpers"

export function Newsletter() {
  const { notify } = useCart()
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus("loading")
    setError(null)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), website: fd.get("website") ?? "" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Something went wrong")
      setStatus("done")
      form.reset()
      notify("You're on the list ♡")
    } catch (err) {
      setStatus("idle")
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-24">
      <Reveal className="glass flex flex-col items-start justify-between gap-8 rounded-[2.5rem] p-8 md:flex-row md:items-center md:p-12">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-accent/40 to-primary/40">
            <MailHeart className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">A little love in your inbox.</h2>
            <p className="mt-2 text-sm text-muted-foreground">New drops, gift ideas and behind-the-scenes from our craft corner.</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="w-full md:max-w-md">
          <div className="glass flex items-center gap-2 rounded-full p-1.5">
            <label htmlFor="newsletter-email" className="sr-only">
              Your email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {status === "done" ? "Subscribed" : "Count me in"}
              {status === "idle" && <ArrowRight className="size-4" aria-hidden="true" />}
            </button>
          </div>
          <p role="status" className="mt-2 min-h-5 px-4 text-xs text-destructive">
            {error}
          </p>
        </form>
      </Reveal>
    </section>
  )
}

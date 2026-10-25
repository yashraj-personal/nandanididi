import { ArrowUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { site, whatsappUrl } from "@/lib/site"

export function Footer({ homePrefix = "" }: { homePrefix?: string }) {
  const year = new Date().getFullYear()
  return (
    <footer id="contact" className="relative mx-auto max-w-6xl px-5 pb-8">
      <div className="glass overflow-hidden rounded-[2.5rem] p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl">Nandani ♡</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Small handmade things, made with a whole lot of heart. Thank you for supporting a small creative business.
            </p>
          </div>
          <nav aria-label="Explore">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Explore</h3>
            <ul className="mt-4 grid gap-3 text-sm text-foreground/80">
              <li><Link className="hover:text-foreground" href={`${homePrefix}#shop`}>Shop all</Link></li>
              <li><Link className="hover:text-foreground" href={`${homePrefix}#story`}>Our story</Link></li>
              <li><Link className="hover:text-foreground" href={`${homePrefix}#custom`}>Custom orders</Link></li>
              <li><Link className="hover:text-foreground" href="/support">Support portal</Link></li>
            </ul>
          </nav>
          <nav aria-label="Help">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Need help?</h3>
            <ul className="mt-4 grid gap-3 text-sm text-foreground/80">
              <li>
                <a className="hover:text-foreground" target="_blank" rel="noopener noreferrer" href={whatsappUrl("Hi Nandani! I have a question about shipping & delivery.")}>
                  Shipping & delivery
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" target="_blank" rel="noopener noreferrer" href={whatsappUrl("Hi Nandani! I have a question about my order.")}>
                  Order help
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Social">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Say hello</h3>
            <ul className="mt-4 grid gap-3 text-sm text-foreground/80">
              <li>
                <a className="inline-flex items-center gap-1 hover:text-foreground" target="_blank" rel="noopener noreferrer" href={whatsappUrl("Hi Nandani! I'd like to know more about your handmade products.")}>
                  WhatsApp <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-1 hover:text-foreground" target="_blank" rel="noopener noreferrer" href={site.instagram}>
                  Instagram <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </li>
              <li className="text-muted-foreground">Made with ♡ in India</li>
            </ul>
          </nav>
        </div>

        <p aria-hidden="true" className="mt-12 select-none text-center font-serif text-[clamp(4rem,18vw,13rem)] italic leading-none text-outline">
          Nandani
        </p>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {site.fullName}. Made with love.</p>
          <Link href={`${homePrefix}#home`} className="inline-flex items-center gap-1 hover:text-foreground">
            Back to top <ArrowUp className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

import { CustomOrders } from "@/components/site/custom-orders"
import { Hero } from "@/components/site/hero"
import { Marquee } from "@/components/site/marquee"
import { Newsletter } from "@/components/site/newsletter"
import { Shop } from "@/components/site/shop"
import { SiteShell } from "@/components/site/site-shell"
import { Story } from "@/components/site/story"

export default function Page() {
  return (
    <SiteShell>
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Shop />
        <Story />
        <CustomOrders />
        <Newsletter />
      </main>
    </SiteShell>
  )
}

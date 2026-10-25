import type { ReactNode } from "react"
import { CartDrawer } from "./cart-drawer"
import { CartProvider } from "./cart-provider"
import { CursorTrail } from "./cursor-trail"
import { Footer } from "./footer"
import { Header } from "./header"
import { LiveBackground } from "./live-background"
import { Toast } from "./toast"

export function SiteShell({
  children,
  homePrefix = "",
}: {
  children: ReactNode
  homePrefix?: string
}) {
  return (
    <CartProvider>
      <LiveBackground />
      <CursorTrail />
      <Header homePrefix={homePrefix} />
      {children}
      <div className="relative z-10">
        <Footer homePrefix={homePrefix} />
      </div>
      <CartDrawer />
      <Toast />
    </CartProvider>
  )
}

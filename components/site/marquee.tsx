import { Flower2, Gift, Heart, Package, Sparkles, Star } from "lucide-react"

const items = [
  { icon: Flower2, label: "Made with care" },
  { icon: Heart, label: "Personalized gifts" },
  { icon: Sparkles, label: "Small-batch creations" },
  { icon: Gift, label: "Gift-ready packaging" },
  { icon: Package, label: "Ships across India" },
  { icon: Star, label: "Custom orders open" },
]

export function Marquee() {
  return (
    <div className="relative z-10 -rotate-1 py-6">
      <div className="glass overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10 hover:[animation-play-state:paused]">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              aria-hidden={i >= items.length}
              className="flex items-center gap-3 whitespace-nowrap font-serif text-xl italic text-foreground/90 md:text-2xl"
            >
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              {item.label}
              <span className="ml-7 text-accent" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

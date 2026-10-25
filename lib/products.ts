export const categories = ["Keychains", "Stickers", "Gifts", "Bookmarks"] as const
export type Category = (typeof categories)[number]

export type Product = {
  id: number
  name: string
  category: Category
  price: number
  oldPrice?: number
  tag?: string
  image: string
  description: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Personalized Name Keychain",
    category: "Keychains",
    price: 99,
    oldPrice: 129,
    tag: "Bestseller",
    image: "/nandanididi/images/name-keychain.png",
    description: "A tiny personalized keepsake with your name on it.",
  },
  {
    id: 2,
    name: "Pastel Sticker Pack",
    category: "Stickers",
    price: 49,
    tag: "Cute pick",
    image: "/nandanididi/images/sticker-pack.png",
    description: "Little stickers for your favourite things.",
  },
  {
    id: 3,
    name: "Pressed Flower Bookmark",
    category: "Bookmarks",
    price: 129,
    oldPrice: 159,
    tag: "Handmade",
    image: "/nandanididi/images/flower-bookmark.png",
    description: "Real flowers, sealed forever. For book lovers.",
  },
  {
    id: 4,
    name: "Mini Gift Hamper",
    category: "Gifts",
    price: 249,
    oldPrice: 299,
    tag: "Gift ready",
    image: "/nandanididi/images/gift-hamper.png",
    description: "A little bundle of happy surprises.",
  },
  {
    id: 5,
    name: "Floral Resin Charm",
    category: "Keychains",
    price: 119,
    tag: "New",
    image: "/nandanididi/images/resin-charm.png",
    description: "A floral heart charm for your bag or keys.",
  },
  {
    id: 6,
    name: "Cute Quote Sticker Set",
    category: "Stickers",
    price: 59,
    image: "/nandanididi/images/quote-stickers.png",
    description: "Add a little personality to your journal.",
  },
  {
    id: 7,
    name: "Bestie Gift Duo",
    category: "Gifts",
    price: 199,
    oldPrice: 229,
    tag: "For besties",
    image: "/nandanididi/images/bestie-duo.png",
    description: "A matching surprise for your favourite person.",
  },
  {
    id: 8,
    name: "Minimal Floral Bookmark",
    category: "Bookmarks",
    price: 89,
    image: "/nandanididi/images/minimal-bookmark.png",
    description: "A soft, simple detail for reading time.",
  },
]

export function getProduct(id: number) {
  return products.find((p) => p.id === id)
}

export function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN")
}

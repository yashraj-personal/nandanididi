export const site = {
  name: "Nandani",
  fullName: "Nandani Handmade Gifts & Crafts",
  // WhatsApp number with country code, digits only.
  whatsapp: "919801963800",
  instagram: "https://www.instagram.com/",
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

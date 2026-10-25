import { NextResponse } from "next/server"
import { z } from "zod"
import { formatINR, getProduct } from "@/lib/products"
import { sendToSheet } from "@/lib/sheets"

const MAX_QTY_PER_ITEM = 20
const MAX_TOTAL_QTY = 50

const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Please enter your name").max(80),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{10,16}$/, "Please enter a valid phone number"),
    email: z.union([z.literal(""), z.email("Please enter a valid email").max(120)]).optional(),
    address: z.string().trim().min(5, "Please enter your full address").max(300),
    city: z.string().trim().min(2, "Please enter your city").max(60),
    pincode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode"),
    notes: z.string().trim().max(500).optional(),
  }),
  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        qty: z.number().int().min(1).max(MAX_QTY_PER_ITEM),
      }),
    )
    .min(1, "Your bag is empty")
    .max(30),
  website: z.string().max(0).optional(),
})

function createOrderId() {
  const now = new Date()
  const date = now.toISOString().slice(2, 10).replace(/-/g, "")
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase()
  return `NDN-${date}-${rand}`
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = orderSchema.safeParse(json)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid order"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { customer, items } = parsed.data

  const merged = new Map<number, number>()
  for (const item of items) {
    merged.set(item.id, (merged.get(item.id) ?? 0) + item.qty)
  }

  const lines: { id: number; name: string; price: number; qty: number; lineTotal: number }[] = []
  let totalQty = 0
  for (const [id, qty] of merged) {
    const product = getProduct(id)
    if (!product) {
      return NextResponse.json({ error: "One of the items is no longer available" }, { status: 400 })
    }
    if (qty > MAX_QTY_PER_ITEM) {
      return NextResponse.json(
        { error: `Maximum ${MAX_QTY_PER_ITEM} of each item per order` },
        { status: 400 },
      )
    }
    totalQty += qty
    lines.push({ id, name: product.name, price: product.price, qty, lineTotal: product.price * qty })
  }

  if (totalQty > MAX_TOTAL_QTY) {
    return NextResponse.json(
      { error: `For orders above ${MAX_TOTAL_QTY} items, please message us on WhatsApp` },
      { status: 400 },
    )
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const order = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    customer: { ...customer, email: customer.email ?? "", notes: customer.notes ?? "" },
    lines,
    totalQty,
    subtotal,
    itemsText: lines.map((l) => `${l.name} x ${l.qty} (${formatINR(l.lineTotal)})`).join("\n"),
  }

  let stored = false
  try {
    ;({ stored } = await sendToSheet({ type: "order", order }))
  } catch (error) {
    console.error("[orders] Failed to write order to sheet:", order.id, error)
  }

  return NextResponse.json({
    order: { id: order.id, lines, totalQty, subtotal, customerName: customer.name },
    stored,
  })
}

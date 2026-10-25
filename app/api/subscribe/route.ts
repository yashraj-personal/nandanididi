import { NextResponse } from "next/server"
import { z } from "zod"
import { sendToSheet } from "@/lib/sheets"

const schema = z.object({
  email: z.email("Please enter a valid email").max(120),
  website: z.string().max(0).optional(),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid email" }, { status: 400 })
  }

  try {
    await sendToSheet({
      type: "subscriber",
      subscriber: { email: parsed.data.email.toLowerCase(), createdAt: new Date().toISOString(), source: "website" },
    })
  } catch (error) {
    console.error("[subscribe] Failed to write subscriber:", error)
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

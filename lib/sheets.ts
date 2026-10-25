type SheetPayload =
  | { type: "order"; order: Record<string, unknown> }
  | { type: "subscriber"; subscriber: { email: string; createdAt: string; source: string } }

export async function sendToSheet(payload: SheetPayload): Promise<{ stored: boolean }> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) {
    console.warn("[sheets] GOOGLE_SHEETS_WEBHOOK_URL is not set; skipping sheet write.")
    return { stored: false }
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, secret: process.env.GOOGLE_SHEETS_SECRET ?? "" }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  })

  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? `Sheet webhook responded with ${res.status}`)
  }
  return { stored: true }
}

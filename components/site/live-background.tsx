"use client"

import { useEffect, useRef } from "react"

type Particle = { x: number; y: number; vx: number; vy: number; r: number; phase: number }

const BLOBS = [
  { rgb: "245,163,183", size: 0.55, x: 0.18, y: 0.2, speed: 0.00011, phase: 0 },
  { rgb: "185,167,255", size: 0.6, x: 0.85, y: 0.25, speed: 0.00009, phase: 2 },
  { rgb: "255,207,168", size: 0.42, x: 0.55, y: 0.85, speed: 0.00013, phase: 4 },
  { rgb: "212,120,170", size: 0.5, x: 0.1, y: 0.9, speed: 0.0001, phase: 1 },
]

export function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    const pointer = { x: -9999, y: -9999, nx: 0.5, ny: 0.5, sx: 0.5, sy: 0.5 }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(120, (width * height) / 13000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.3 - 0.05,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      pointer.sx += (pointer.nx - pointer.sx) * 0.03
      pointer.sy += (pointer.ny - pointer.sy) * 0.03

      ctx.globalCompositeOperation = "lighter"
      BLOBS.forEach((b, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        const cx = (b.x + Math.sin(t * b.speed + b.phase) * 0.12 + (pointer.sx - 0.5) * 0.12 * dir) * width
        const cy = (b.y + Math.cos(t * b.speed * 1.3 + b.phase) * 0.1 + (pointer.sy - 0.5) * 0.1 * dir) * height
        const radius = b.size * Math.max(width, height)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        g.addColorStop(0, `rgba(${b.rgb},0.28)`)
        g.addColorStop(0.5, `rgba(${b.rgb},0.08)`)
        g.addColorStop(1, `rgba(${b.rgb},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
      })
      ctx.globalCompositeOperation = "source-over"

      for (const p of particles) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140
          p.vx += (dx / dist) * force * 0.35
          p.vy += (dy / dist) * force * 0.35
        }
        p.vx *= 0.96
        p.vy = p.vy * 0.96 - 0.004
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) p.y = height + 10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const alpha = 0.35 + Math.sin(t * 0.002 + p.phase) * 0.3
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,236,242,${alpha})`
        ctx.fill()

        if (dist < 170) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.strokeStyle = `rgba(245,163,183,${(1 - dist / 170) * 0.35})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.nx = e.clientX / width
      pointer.ny = e.clientY / height
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    const onDown = (e: PointerEvent) => {
      for (const p of particles) {
        const dx = p.x - e.clientX
        const dy = p.y - e.clientY
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 260) {
          const force = ((260 - dist) / 260) * 6
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }
    }
    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      document.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,5,12,0.75)_100%)]"
      />
    </>
  )
}

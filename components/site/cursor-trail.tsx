"use client"

import { useEffect, useRef } from "react"

type Point = { x: number; y: number; life: number }
type Spark = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  heart: boolean
  rotation: number
  spin: number
  phase: number
  wiggle: number
}

const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']"

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf: number | null = null
    let lastParticleAt = 0
    let lastParticleX = -100
    let lastParticleY = -100
    const points: Point[] = []
    const sparks: Spark[] = []
    const ring = { x: -100, y: -100, tx: -100, ty: -100, r: 16, tr: 16, visible: false }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawHeart = (x: number, y: number, size: number, rotation: number, scale: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.scale(scale, scale)
      ctx.beginPath()
      ctx.moveTo(0, size * 0.3)
      ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.3)
      ctx.bezierCurveTo(-size * 0.5, size * 0.6, 0, size * 0.8, 0, size)
      ctx.bezierCurveTo(0, size * 0.8, size * 0.5, size * 0.6, size * 0.5, size * 0.3)
      ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.3)
      ctx.fill()
      ctx.restore()
    }

    const scheduleFrame = () => {
      if (raf !== null || document.hidden) return
      raf = window.requestAnimationFrame(frame)
    }

    const frame = () => {
      raf = null
      ctx.clearRect(0, 0, width, height)

      for (let i = points.length - 1; i >= 0; i--) {
        points[i].life -= 0.045
        if (points[i].life <= 0) points.splice(i, 1)
      }
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        const t = i / points.length
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.lineCap = "round"
        ctx.lineWidth = t * 6 * b.life
        ctx.strokeStyle = `rgba(${Math.round(185 + 60 * t)},${Math.round(167 - 4 * t)},${Math.round(255 - 72 * t)},${b.life * 0.8})`
        ctx.shadowColor = "rgba(245,163,183,0.9)"
        ctx.shadowBlur = 12
        ctx.stroke()
      }
      ctx.shadowBlur = 0

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]
        spark.phase += 0.18
        spark.x += spark.vx + Math.sin(spark.phase) * spark.wiggle
        spark.y += spark.vy
        spark.vy += 0.03
        spark.rotation += spark.spin
        spark.life -= 0.025
        if (spark.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        const scale = 1 + Math.sin(spark.phase * 2) * 0.14
        const opacity = Math.min(1, spark.life)
        ctx.fillStyle = spark.heart
          ? `rgba(245,163,183,${opacity})`
          : `rgba(255,220,200,${opacity})`
        if (spark.heart) drawHeart(spark.x, spark.y, spark.size, spark.rotation, scale)
        else {
          ctx.beginPath()
          ctx.arc(spark.x, spark.y, spark.size * 0.25 * scale, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ring.x += (ring.tx - ring.x) * 0.18
      ring.y += (ring.ty - ring.y) * 0.18
      ring.r += (ring.tr - ring.r) * 0.15
      if (ring.visible) {
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255,255,255,0.55)"
        ctx.lineWidth = 1
        ctx.stroke()
        if (ring.tr > 16) {
          ctx.fillStyle = "rgba(245,163,183,0.12)"
          ctx.fill()
        }
      }

      const ringIsMoving =
        ring.visible &&
        (Math.abs(ring.tx - ring.x) > 0.2 ||
          Math.abs(ring.ty - ring.y) > 0.2 ||
          Math.abs(ring.tr - ring.r) > 0.2)
      if (points.length > 0 || sparks.length > 0 || ringIsMoving) scheduleFrame()
    }

    const addTrailSparks = (x: number, y: number, isTouch: boolean) => {
      const count = isTouch ? 4 : 3
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 0.9
        sparks.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed * 0.55,
          vy: -0.2 - Math.random() * 0.9,
          life: 0.82 + Math.random() * 0.18,
          size: Math.random() * 3 + 4,
          heart: Math.random() < (isTouch ? 0.94 : 0.86),
          rotation: (Math.random() - 0.5) * 0.8,
          spin: (Math.random() - 0.5) * 0.12,
          phase: Math.random() * Math.PI * 2,
          wiggle: 0.25 + Math.random() * 0.7,
        })
      }
      if (sparks.length > 96) sparks.splice(0, sparks.length - 96)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "touch" && e.pointerType !== "pen") return
      const isTouch = e.pointerType === "touch"
      ring.visible = true
      ring.tx = e.clientX
      ring.ty = e.clientY
      points.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (points.length > 34) points.shift()

      const now = performance.now()
      const distance = Math.hypot(e.clientX - lastParticleX, e.clientY - lastParticleY)
      const minInterval = isTouch ? 42 : 34
      const minDistance = isTouch ? 2 : 3
      if (now - lastParticleAt >= minInterval && distance >= minDistance) {
        addTrailSparks(e.clientX, e.clientY, isTouch)
        lastParticleAt = now
        lastParticleX = e.clientX
        lastParticleY = e.clientY
      }
      scheduleFrame()
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      ring.tr = target?.closest?.(INTERACTIVE) ? 28 : 16
      scheduleFrame()
    }

    const onDown = (e: PointerEvent) => {
      const isTouch = e.pointerType === "touch"
      if (isTouch) {
        ring.visible = true
        ring.tx = e.clientX
        ring.ty = e.clientY
      }
      const count = isTouch ? 22 : 20
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = 1.2 + Math.random() * 1.5
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 0.9 + Math.random() * 0.2,
          size: Math.random() * 3.5 + 5,
          heart: i % 5 !== 0,
          rotation: (Math.random() - 0.5) * 0.8,
          spin: (Math.random() - 0.5) * 0.16,
          phase: Math.random() * Math.PI * 2,
          wiggle: 0.25 + Math.random() * 0.8,
        })
      }
      if (sparks.length > 96) sparks.splice(0, sparks.length - 96)
      scheduleFrame()
    }

    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        ring.visible = false
        ring.tr = 16
        scheduleFrame()
      }
    }

    const onLeave = () => {
      ring.visible = false
      ring.tr = 16
      scheduleFrame()
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (raf !== null) window.cancelAnimationFrame(raf)
        raf = null
        return
      }
      scheduleFrame()
    }

    const onResize = () => {
      resize()
      scheduleFrame()
    }

    resize()
    scheduleFrame()
    window.addEventListener("resize", onResize)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    window.addEventListener("pointercancel", onUp, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      if (raf !== null) window.cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" />
}

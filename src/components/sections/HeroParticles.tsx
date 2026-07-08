'use client'

import { useEffect, useRef } from 'react'

// Damcraft mark geometry (from the brand SVG, viewBox 400×400)
const LOGO_PATH =
  'M204.62,90.12h-9.24c-71.33,0-129.15,57.82-129.15,129.15v90.61h28.41l24.55-67.29h22.74l24.55,67.29h27.61v-67.31h27.35l28.27,57.01,28.43-57.01h27.2v67.31h28.42v-90.61c0-71.33-57.82-129.15-129.15-129.15Z'
const LOGO_POLYGONS: number[][][] = [
  [[117.5, 309.88], [139.93, 309.88], [143.31, 309.88], [130.56, 271.33], [117.5, 309.88]],
  [[219.29, 286.36], [219.29, 309.88], [222.47, 309.88], [231.01, 309.88], [219.29, 286.36]],
  [[280.14, 309.88], [280.14, 286.36], [268.42, 309.88], [280.14, 309.88]],
]
// artwork bounds inside the viewBox
const ART_X = 66.23
const ART_Y = 90.12
const ART_W = 267.54
const ART_H = 219.76

type SpriteKind = 0 | 1 | 2 // 0 = glow orb, 1 = pixel square, 2 = sparkle star

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  size: number
  phase: number
  twinkleSpeed: number
  spring: number
  kind: SpriteKind
}

// ── Sprite factory — pre-rendered so the rAF loop is pure drawImage ──
function makeGlowOrb(): HTMLCanvasElement {
  const s = 32
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.7)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, s, s)
  return c
}

function makePixel(): HTMLCanvasElement {
  const s = 8
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  const g = c.getContext('2d')!
  g.fillStyle = '#fff'
  g.fillRect(1, 1, s - 2, s - 2)
  return c
}

function makeSparkleStar(): HTMLCanvasElement {
  const s = 48
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  const g = c.getContext('2d')!
  const cx = s / 2
  const cy = s / 2
  const R = s / 2 - 1 // long point
  const r = s / 9 // waist
  // soft halo behind the star
  const halo = g.createRadialGradient(cx, cy, 0, cx, cy, R)
  halo.addColorStop(0, 'rgba(255,255,255,0.55)')
  halo.addColorStop(0.5, 'rgba(220,220,220,0.18)')
  halo.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = halo
  g.fillRect(0, 0, s, s)
  // 4-point star with concave waists
  g.beginPath()
  g.moveTo(cx, cy - R)
  g.quadraticCurveTo(cx + r * 0.4, cy - r * 0.4, cx + R, cy)
  g.quadraticCurveTo(cx + r * 0.4, cy + r * 0.4, cx, cy + R)
  g.quadraticCurveTo(cx - r * 0.4, cy + r * 0.4, cx - R, cy)
  g.quadraticCurveTo(cx - r * 0.4, cy - r * 0.4, cx, cy - R)
  g.closePath()
  g.fillStyle = '#fff'
  g.fill()
  return c
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprites = [makeGlowOrb(), makePixel(), makeSparkleStar()]
    let raf = 0
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // rasterize the mark offscreen and sample it into target points
      const S = 320
      const off = document.createElement('canvas')
      off.width = S
      off.height = S
      const octx = off.getContext('2d')
      if (!octx) return
      // mark fills 70% of the canvas — the margin keeps halos and
      // scattered particles from clipping at the canvas edge
      const scale = (S * 0.7) / ART_W
      octx.translate(
        (S - ART_W * scale) / 2 - ART_X * scale,
        (S - ART_H * scale) / 2 - ART_Y * scale,
      )
      octx.scale(scale, scale)
      octx.fillStyle = '#fff'
      octx.fill(new Path2D(LOGO_PATH))
      for (const poly of LOGO_POLYGONS) {
        octx.beginPath()
        octx.moveTo(poly[0][0], poly[0][1])
        for (let i = 1; i < poly.length; i++) octx.lineTo(poly[i][0], poly[i][1])
        octx.closePath()
        octx.fill()
      }

      const data = octx.getImageData(0, 0, S, S).data
      const gap = 4
      particles = []
      for (let y = 0; y < S; y += gap) {
        for (let x = 0; x < S; x += gap) {
          if (data[(y * S + x) * 4 + 3] > 128) {
            // species mix: 62% glow orbs, 28% pixels, 10% sparkle stars
            const roll = Math.random()
            const kind: SpriteKind = roll < 0.62 ? 0 : roll < 0.9 ? 1 : 2
            const base = kind === 2 ? 7 + Math.random() * 6 : kind === 0 ? 3.5 + Math.random() * 3 : 2 + Math.random() * 1.8
            // scatter start positions inside a circle so the canvas
            // never reads as a square during assembly
            const ang = Math.random() * Math.PI * 2
            const rad = Math.sqrt(Math.random()) * (Math.min(W, H) / 2)
            particles.push({
              x: W / 2 + Math.cos(ang) * rad,
              y: H / 2 + Math.sin(ang) * rad,
              vx: 0,
              vy: 0,
              tx: (x / S) * W,
              ty: (y / S) * H,
              size: base,
              phase: Math.random() * Math.PI * 2,
              twinkleSpeed: 1.4 + Math.random() * 1.8,
              spring: 0.016 + Math.random() * 0.014,
              kind,
            })
          }
        }
      }

      if (reducedMotion) {
        ctx.clearRect(0, 0, W, H)
        for (const p of particles) {
          ctx.globalAlpha = 0.5 + Math.random() * 0.5
          const sp = sprites[p.kind]
          ctx.drawImage(sp, p.tx - p.size / 2, p.ty - p.size / 2, p.size, p.size)
        }
        ctx.globalAlpha = 1
      }
    }

    let t = 0
    const tick = () => {
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      t += 0.016
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        // spring toward home position in the mark
        p.vx += (p.tx - p.x) * p.spring
        p.vy += (p.ty - p.y) * p.spring
        // cursor interaction — scatter, brighten, and swell nearby
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        let near = 0
        if (d2 < 10000) {
          const d = Math.sqrt(d2) || 1
          near = (100 - d) / 100
          const f = near * 2.6
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy

        // starlike twinkle; sparkle stars also pulse in scale
        const tw = 0.5 + 0.5 * Math.sin(t * p.twinkleSpeed + p.phase)
        let s = p.size
        if (p.kind === 2) s *= 0.8 + 0.45 * tw
        s *= 1 + near * 0.9 // swell near the cursor
        ctx.globalAlpha = Math.min(1, (0.35 + 0.65 * tw) * 0.9 + near * 0.6)
        ctx.drawImage(sprites[p.kind], p.x - s / 2, p.y - s / 2, s, s)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onPointerLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(init, 200)
    }

    init()
    if (!reducedMotion) {
      raf = requestAnimationFrame(tick)
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-particles"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width/height/top live in globals.css (.hero-particles) so
        // the mobile breakpoint can resize and reposition it
        pointerEvents: 'none',
        opacity: 0, // GSAP fades it in with the hero timeline
      }}
    />
  )
}

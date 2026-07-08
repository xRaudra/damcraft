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

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  size: number
  phase: number
  spring: number
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
      const scale = (S * 0.94) / ART_W
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
            particles.push({
              x: Math.random() * W,
              y: Math.random() * H,
              vx: 0,
              vy: 0,
              tx: (x / S) * W,
              ty: (y / S) * H,
              size: 1 + Math.random() * 1.7,
              phase: Math.random() * Math.PI * 2,
              spring: 0.016 + Math.random() * 0.014,
            })
          }
        }
      }

      if (reducedMotion) {
        // static mark, gentle alpha variation, no animation loop
        ctx.clearRect(0, 0, W, H)
        ctx.fillStyle = '#fff'
        for (const p of particles) {
          ctx.globalAlpha = 0.5 + Math.random() * 0.5
          ctx.fillRect(p.tx, p.ty, p.size, p.size)
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
      ctx.fillStyle = '#fff'
      for (const p of particles) {
        // spring toward home position in the mark
        p.vx += (p.tx - p.x) * p.spring
        p.vy += (p.ty - p.y) * p.spring
        // scatter away from the cursor
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 7200) {
          const d = Math.sqrt(d2) || 1
          const f = ((85 - d) / 85) * 2.4
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy
        // starlike twinkle
        ctx.globalAlpha = (0.5 + 0.5 * Math.sin(t * 2.2 + p.phase)) * 0.85 + 0.1
        ctx.fillRect(p.x, p.y, p.size, p.size)
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
        top: '42%',
        transform: 'translate(-50%, -50%)',
        width: 'clamp(280px, 46vh, 480px)',
        height: 'clamp(280px, 46vh, 480px)',
        pointerEvents: 'none',
        opacity: 0, // GSAP fades it in with the hero timeline
      }}
    />
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Geometry } from 'ogl'

// Damcraft mark geometry (from the brand SVG, viewBox 400×400)
const LOGO_PATH =
  'M204.62,90.12h-9.24c-71.33,0-129.15,57.82-129.15,129.15v90.61h28.41l24.55-67.29h22.74l24.55,67.29h27.61v-67.31h27.35l28.27,57.01,28.43-57.01h27.2v67.31h28.42v-90.61c0-71.33-57.82-129.15-129.15-129.15Z'
const LOGO_POLYGONS: number[][][] = [
  [[117.5, 309.88], [139.93, 309.88], [143.31, 309.88], [130.56, 271.33], [117.5, 309.88]],
  [[219.29, 286.36], [219.29, 309.88], [222.47, 309.88], [231.01, 309.88], [219.29, 286.36]],
  [[280.14, 309.88], [280.14, 286.36], [268.42, 309.88], [280.14, 309.88]],
]
const ART_X = 66.23
const ART_Y = 90.12
const ART_W = 267.54
const ART_H = 219.76

const PARTICLES_PER_SAMPLE = 2
const SAMPLE_GAP = 2 // px in the 320px raster — ~7k samples → ~14k particles
const MARK_FILL = 0.7 // mark occupies 70% of the canvas

const VERTEX = /* glsl */ `
  attribute vec2 aTarget;   // home position in the mark, -0.5..0.5
  attribute vec2 aScatter;  // start position (circle)
  attribute vec4 aRand;     // x phase, y speed, z size, w kind (0 orb / 1 star)

  uniform float uTime;
  uniform float uProgress;
  uniform float uSizeScale;
  uniform vec2 uMouse;
  uniform float uMouseActive;

  varying float vAlpha;
  varying float vKind;

  void main() {
    // staggered assembly — each particle departs on its own beat
    float d = clamp(uProgress * 1.5 - aRand.x * 0.5, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - d, 3.0);
    vec2 pos = mix(aScatter, aTarget, e);

    // gentle idle drift so the mark breathes
    pos += 0.0035 * vec2(
      sin(uTime * (0.6 + aRand.y) + aRand.x * 6.283),
      cos(uTime * (0.5 + aRand.y * 0.8) + aRand.x * 4.19)
    );

    // cursor flow — particles yield to the pointer and swell
    vec2 dm = pos - uMouse;
    float dist = length(dm);
    float force = smoothstep(0.24, 0.0, dist) * uMouseActive;
    pos += (dm / max(dist, 0.0001)) * force * 0.13;

    // twinkle
    float tw = 0.5 + 0.5 * sin(uTime * (1.4 + aRand.y * 2.2) + aRand.x * 6.283);
    vAlpha = (0.3 + 0.7 * tw) * 0.85 + force * 0.7;
    vKind = aRand.w;

    float star = step(0.5, aRand.w);
    float size = aRand.z * mix(1.0, 0.75 + 0.55 * tw, star) * (1.0 + force * 1.4);
    gl_PointSize = size * uSizeScale;
    gl_Position = vec4(pos * 2.0, 0.0, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;

  varying float vAlpha;
  varying float vKind;

  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float d = length(p);
    // soft glow orb
    float glow = pow(max(0.0, 1.0 - d), 2.4);
    // 4-point sparkle spikes for star particles
    float star = 0.0;
    if (vKind > 0.5) {
      float cross_ = max(0.0, 1.0 - abs(p.x * p.y) * 24.0) * max(0.0, 1.0 - d);
      star = pow(cross_, 1.5);
    }
    float a = clamp(glow * 0.85 + star, 0.0, 1.0) * vAlpha;
    if (a < 0.012) discard;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`

// Rasterize the mark and return sample points normalized to -0.5..0.5
function sampleMark(): [number, number][] {
  const S = 320
  const off = document.createElement('canvas')
  off.width = S
  off.height = S
  const octx = off.getContext('2d')
  if (!octx) return []
  const scale = (S * MARK_FILL) / ART_W
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
  const pts: [number, number][] = []
  for (let y = 0; y < S; y += SAMPLE_GAP) {
    for (let x = 0; x < S; x += SAMPLE_GAP) {
      if (data[(y * S + x) * 4 + 3] > 128) {
        pts.push([x / S - 0.5, 0.5 - y / S]) // flip y for GL space
      }
    }
  }
  return pts
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: Renderer
    try {
      renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        alpha: true,
        depth: false,
        antialias: false,
        powerPreference: 'high-performance',
      })
    } catch {
      return // no WebGL — hero simply shows without the mark
    }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    // build geometry from the sampled mark
    const samples = sampleMark()
    const count = samples.length * PARTICLES_PER_SAMPLE
    const target = new Float32Array(count * 2)
    const scatter = new Float32Array(count * 2)
    const rand = new Float32Array(count * 4)
    const jitter = SAMPLE_GAP / 320
    for (let i = 0; i < count; i++) {
      const [sx, sy] = samples[i % samples.length]
      target[i * 2] = sx + (Math.random() - 0.5) * jitter
      target[i * 2 + 1] = sy + (Math.random() - 0.5) * jitter
      // scatter start: random point in a circle (never reads as a box)
      const ang = Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * 0.5
      scatter[i * 2] = Math.cos(ang) * radius
      scatter[i * 2 + 1] = Math.sin(ang) * radius
      const isStar = Math.random() < 0.07
      rand[i * 4] = Math.random() // phase
      rand[i * 4 + 1] = Math.random() // speed
      rand[i * 4 + 2] = isStar ? 26 + Math.random() * 22 : 3 + Math.random() * 8 // size
      rand[i * 4 + 3] = isStar ? 1 : 0 // kind
    }

    const geometry = new Geometry(gl, {
      aTarget: { size: 2, data: target },
      aScatter: { size: 2, data: scatter },
      aRand: { size: 4, data: rand },
    })

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: reducedMotion ? 1 : 0 },
      uSizeScale: { value: 1 },
      uMouse: { value: [10, 10] as [number, number] },
      uMouseActive: { value: 0 },
    }

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    // additive blending — overlapping particles bloom like starlight
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE)

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      // point sizes scale with rendered pixel height
      uniforms.uSizeScale.value = (rect.height * renderer.dpr) / 900
    }
    resize()

    // pointer → normalized mark space, smoothed for a fluid feel
    const mouseTarget = { x: 10, y: 10, active: 0 }
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseTarget.x = (e.clientX - rect.left) / rect.width - 0.5
      mouseTarget.y = 0.5 - (e.clientY - rect.top) / rect.height
      mouseTarget.active = 1
    }
    const onPointerLeave = () => {
      mouseTarget.active = 0
    }

    let raf = 0
    let start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000
      uniforms.uTime.value = t
      // assembly progress eases in over ~2.4s
      uniforms.uProgress.value = Math.min(1, t / 2.4)
      // smooth the cursor
      const m = uniforms.uMouse.value
      m[0] += (mouseTarget.x - m[0]) * 0.12
      m[1] += (mouseTarget.y - m[1]) * 0.12
      uniforms.uMouseActive.value +=
        (mouseTarget.active - uniforms.uMouseActive.value) * 0.08
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(tick)
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }
    window.addEventListener('resize', onResize)

    if (reducedMotion) {
      // single static frame of the assembled mark
      uniforms.uTime.value = 1.7
      renderer.render({ scene: mesh })
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
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

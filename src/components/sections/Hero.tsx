'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ArrowDownPixel } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'

const HEADLINE_LINES = [
  { text: 'Damcraft is a design and technology', dim: false },
  { text: 'studio based in Italy. We deliver',   dim: false },
  { text: 'holistic brand identity & digital',   dim: true  },
  { text: 'experiences.',                         dim: true  },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      // Eyebrow slides up from below
      tl.fromTo(
        '.hero-eyebrow',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
      )

      // Headline lines — classic masked reveal (each line slides up from below its overflow:hidden wrapper)
      tl.fromTo(
        '.mst__inner',
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.085,
        },
        '-=0.45',
      )

      // CTA button fades in after headline
      tl.fromTo(
        '.hero-cta',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.75',
      )

      // Scroll indicator
      tl.fromTo(
        '.scroll-indicator',
        { opacity: 0, y: 8 },
        { opacity: 0.6, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4',
      )

      // Parallax on the background image as we scroll past the hero
      gsap.to('.hero-bg-img', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '90svh', minHeight: '580px' }}
      aria-label="Hero"
    >
      {/* ── Background image ── place /public/hero-bg.jpg ── */}
      <div
        className="hero-bg-img absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.jpg)', willChange: 'transform' }}
      />

      {/* Dark overlay — ensures text is always readable over the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* ── CTA Button — upper right ──────────────────────── */}
      <div
        className="hero-cta absolute"
        style={{
          bottom: 'clamp(64px, 10vh, 140px)',
          right: 'var(--margin-page)',
        }}
      >
        <Button variant="glass">Start a Project</Button>
      </div>

      {/* ── Main text block — lower left ─────────────────── */}
      <div
        className="hero-text-block absolute"
        style={{
          left: 'var(--margin-page)',
          bottom: 'clamp(64px, 10vh, 140px)',
        }}
      >
        {/* Eyebrow */}
        <span
          className="hero-eyebrow block uppercase"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--size-label)',
            lineHeight: '23px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.05em',
            marginBottom: '23.84px',
          }}
        >
          Full-Service Agency
        </span>

        {/* Headline — each line wrapped in overflow:hidden for the masked reveal */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {HEADLINE_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                overflow: 'hidden',
                lineHeight: 'var(--lh-hero)',
              }}
            >
              <span
                className="mst__inner"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--size-hero)',
                  lineHeight: 'var(--lh-hero)',
                  fontWeight: 500,
                  color: '#fff',
                  opacity: line.dim ? 0.2 : 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator — bottom center ─────────────── */}
      <div
        className="scroll-indicator absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: 0, // GSAP animates this to 0.6
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--size-label)',
            lineHeight: '23px',
            color: '#fff',
          }}
        >
          Scroll
        </span>
        <span className="scroll-bounce">
          <ArrowDownPixel color="#fff" />
        </span>
      </div>
    </section>
  )
}

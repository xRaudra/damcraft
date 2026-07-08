'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ArrowDownPixel } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'
import HeroParticles from '@/components/sections/HeroParticles'

// Each line is a list of segments so the bright→dim transition can
// happen mid-line, exactly like the reference.
const HEADLINE_LINES: { text: string; dim: boolean }[][] = [
  [{ text: 'Damcraft is a design and technology', dim: false }],
  [
    { text: 'studio from Noida. ', dim: false },
    { text: "We don't", dim: true },
  ],
  [{ text: 'decorate — we construct brands,', dim: true }],
  [{ text: 'products & experiences.', dim: true }],
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

      // Star-particle logo assembles behind everything
      tl.to('.hero-particles', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.2)

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

      {/* ── Star-particle logo — hero center ─────────────── */}
      <HeroParticles />

      {/* ── CTA Button — floating bottom-right, desktop only ── */}
      <div
        className="hero-cta hero-cta-desktop absolute"
        style={{
          bottom: 'clamp(36px, 5.5vh, 72px)',
          right: 'var(--margin-page)',
        }}
      >
        <Button variant="glass">Start a Project</Button>
      </div>

      {/* ── Main text block — lower left (bottom set in CSS) ── */}
      <div
        className="hero-text-block absolute"
        style={{
          left: 'var(--margin-page)',
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
          {HEADLINE_LINES.map((segments, i) => (
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
                  letterSpacing: '-0.01em',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {segments.map((seg, j) => (
                  <span
                    key={j}
                    style={{ color: seg.dim ? 'rgba(255,255,255,0.22)' : '#fff' }}
                  >
                    {seg.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* In-flow CTA — mobile only, follows the headline */}
        <div className="hero-cta hero-cta-mobile">
          <Button variant="glass">Start a Project</Button>
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
        <span className="scroll-bounce" style={{ alignItems: 'center', gap: '8px' }}>
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
          <ArrowDownPixel color="#fff" />
        </span>
      </div>
    </section>
  )
}

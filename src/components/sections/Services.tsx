'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ServiceCard from '@/components/ui/ServiceCard'
import Button from '@/components/ui/Button'
import { SERVICES } from '@/data/services'

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow label
      gsap.fromTo(
        '.services-eyebrow',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-eyebrow',
            start: 'top 88%',
          },
        },
      )

      // Service cards — staggered reveal row by row
      gsap.fromTo(
        '.service-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: {
            amount: 0.55,
            from: 'start',
          },
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 82%',
          },
        },
      )

      // CTA button
      gsap.fromTo(
        '.services-cta',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-cta',
            start: 'top 92%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: 'var(--color-bg-light)', paddingTop: '122px', paddingBottom: '92px' }}
      aria-label="Our Services"
    >
      {/* ── Eyebrow ───────────────────────────────────── */}
      <div style={{ paddingLeft: 'var(--margin-page)', marginBottom: '15.36px' }}>
        <span
          className="services-eyebrow block uppercase"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--size-label)',
            lineHeight: '23px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          Our Services
        </span>
      </div>

      {/* ── Card grid — 4 columns × 2 rows ──────────── */}
      <div
        className="services-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15.35px',
          margin: `15.36px var(--margin-page) 0`,
        }}
      >
        {SERVICES.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* ── Explore All Services CTA ──────────────────── */}
      <div
        className="services-cta"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '46px',
        }}
      >
        <Button variant="dark">Explore All Services</Button>
      </div>
    </section>
  )
}

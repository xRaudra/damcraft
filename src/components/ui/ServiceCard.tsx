'use client'

import { useRef, useState } from 'react'
import type { Service } from '@/types'

interface ServiceCardProps {
  service: Service
}

const TILT_MAX = 5 // degrees

export default function ServiceCard({ service }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleEnter = () => {
    setHovered(true)
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'transform 0.18s ease-out'
    if (prefersReducedMotion()) {
      el.style.transform = 'scale(1.015)'
    }
  }

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5 // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-py * TILT_MAX).toFixed(2)}deg) rotateY(${(px * TILT_MAX).toFixed(2)}deg) scale(1.02)`
  }

  const handleLeave = () => {
    setHovered(false)
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      className="service-card relative overflow-hidden"
      style={{
        height: 'var(--card-h)',
        borderRadius: 'var(--radius-card)',
        background: service.gradient,
        cursor: 'default',
        willChange: 'transform',
      }}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Background image — drop service photos into public/services/<id>.jpg */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/services/${service.id}.jpg)`,
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              lineHeight: '22px',
              fontWeight: 500,
              color: '#fff',
            }}
          >
            {service.title}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              lineHeight: '16px',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            / {service.count}
          </span>
        </div>

        {/* Footer */}
        <div>
          {/* Tag pills — frosted light, revealed on hover */}
          <div className="flex flex-wrap gap-[7px] mb-4">
            {service.tags.map((tag, i) => (
              <span
                key={i}
                className="card-tag"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12.5px',
                  lineHeight: '18px',
                  color: '#1c1c1c',
                  background: 'rgba(240, 240, 240, 0.9)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* See More */}
          <div className="flex justify-end">
            <button
              type="button"
              className="cta-shine"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                lineHeight: '18px',
                padding: '2px 8px',
                color: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
            >
              See More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

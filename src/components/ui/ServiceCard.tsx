'use client'

import { useState } from 'react'
import type { Service } from '@/types'

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="service-card relative overflow-hidden"
      style={{
        height: 'var(--card-h)',
        borderRadius: 'var(--radius-card)',
        background: service.gradient,
        cursor: 'default',
        transform: hovered ? 'scale(1.015)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          {/* Tag pills */}
          <div className="flex flex-wrap gap-[6px] mb-4">
            {service.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11.5px',
                  lineHeight: '17px',
                  color: 'rgba(255,255,255,0.88)',
                  background: 'rgba(15, 15, 15, 0.75)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'background 0.2s ease',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* See More */}
          <div className="flex justify-end">
            <button
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

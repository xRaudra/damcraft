'use client'

import { useEffect, useRef, useState, FormEvent } from 'react'
import { gsap } from '@/lib/gsap'
import Button from '@/components/ui/Button'
import { SERVICES } from '@/data/services'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '13.8px',
  lineHeight: '20px',
  color: '#fff',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const ctx = gsap.context(() => {
      // headline lines — masked reveal on scroll
      gsap.fromTo(
        '.cf-line-inner',
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.09,
          scrollTrigger: { trigger: '.cf-panel', start: 'top 78%' },
        },
      )
      // form fades up as a block
      gsap.fromTo(
        '.cf-form',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.cf-panel', start: 'top 74%' },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const toggleService = (title: string) => {
    setSelected(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title],
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          message: data.get('message'),
          services: selected,
        }),
      })
      if (!res.ok) throw new Error('send failed')
      setStatus('sent')
      form.reset()
      setSelected([])
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Request a quote"
      style={{ background: '#000', padding: '60px var(--margin-page) 60px' }}
    >
      <div
        className="cf-panel"
        style={{
          background: '#101010',
          borderRadius: '15.36px',
          padding: '30.72px',
        }}
      >
        {/* ── Left — headline ─────────────────────────── */}
        <div style={{ flex: '0 0 auto', width: 'min(440px, 100%)' }}>
          <h2 style={{ margin: 0 }}>
            {[
              { text: 'Ready to get', dim: false },
              { text: 'started?', dim: true },
            ].map((line, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  lineHeight: 1.15,
                }}
              >
                <span
                  className="cf-line-inner"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--size-hero)',
                    lineHeight: 1.15,
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: line.dim ? 'rgba(255,255,255,0.22)' : '#fff',
                  }}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── Right — form ────────────────────────────── */}
        <form className="cf-form" style={{ flex: 1, opacity: 0 }} onSubmit={handleSubmit}>
          <p style={{ ...LABEL_STYLE, marginBottom: '15.3px' }}>
            Fill the form to request a quote:
          </p>

          <div className="cf-row" style={{ marginBottom: '15.35px' }}>
            <input
              className="cf-input"
              name="name"
              type="text"
              placeholder="Your Name *"
              required
              autoComplete="name"
            />
            <input
              className="cf-input"
              name="email"
              type="email"
              placeholder="Email *"
              required
              autoComplete="email"
            />
          </div>

          <input
            className="cf-input"
            name="phone"
            type="tel"
            placeholder="Phone (Optional)"
            autoComplete="tel"
            style={{ marginBottom: '15.35px' }}
          />

          <textarea
            className="cf-input"
            name="message"
            placeholder="Tell us about your project *"
            required
            rows={7}
            style={{ resize: 'vertical', minHeight: '230px', marginBottom: '30.7px' }}
          />

          <p style={{ ...LABEL_STYLE, marginBottom: '18px' }}>
            Services are interested in
          </p>

          <div className="cf-services-grid" style={{ marginBottom: '35px' }}>
            {SERVICES.map(s => {
              const active = selected.includes(s.title)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.title)}
                  aria-pressed={active}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'none',
                    border: 'none',
                    padding: '2px 0',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '17px',
                      height: '17px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      border: active
                        ? '5px solid #fff'
                        : '1.5px solid rgba(159,159,159,0.6)',
                      transition: 'border 0.2s ease',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '15.4px',
                      lineHeight: '23px',
                      color: active ? '#fff' : 'rgba(159,159,159,0.9)',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {s.title}
                  </span>
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <Button variant="glass" type="submit" disabled={status === 'sending'}>
              {status === 'sending'
                ? 'Sending…'
                : status === 'sent'
                  ? 'Message Sent'
                  : 'Send Message'}
            </Button>
            {status === 'sent' && (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13.8px',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Thanks — we&apos;ll get back to you within 24 hours.
              </span>
            )}
            {status === 'error' && (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13.8px',
                  color: 'rgba(255,120,120,0.9)',
                }}
              >
                Something went wrong — email us at hello@damcraft.com
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DamcraftLogoMark, EmailPixel } from '@/components/ui/Icons'

const NAV_LINKS = [
  { label: 'Services',  href: '/services'  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About',     href: '/about'     },
  { label: 'Insights',  href: '/insights'  },
  { label: 'Contact',   href: '/contact'   },
]

const PILL_STYLE: React.CSSProperties = {
  background: 'var(--color-glass-nav)',
  backdropFilter: 'var(--blur-glass)',
  WebkitBackdropFilter: 'var(--blur-glass)',
  borderRadius: 'var(--radius-nav)',
  height: 'var(--nav-pill-height)',
  display: 'flex',
  alignItems: 'center',
}

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 'var(--nav-top)',
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 15.35px',
          pointerEvents: 'none',
        }}
      >
        {/* ── Logo pill ─────────────────────────────────── */}
        <div
          style={{ ...PILL_STYLE, width: '55px', justifyContent: 'center', pointerEvents: 'auto' }}
        >
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Damcraft home"
          >
            <DamcraftLogoMark />
          </Link>
        </div>

        {/* ── Navigation links pill — desktop only ──────── */}
        <div
          className="nav-desktop"
          style={{
            ...PILL_STYLE,
            display: undefined, // CSS class controls visibility per breakpoint
            padding: '7.68px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    width: '129px',
                    height: '36.36px',
                    borderRadius: 'var(--radius-nav-link)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--size-nav)',
                    lineHeight: '20.74px',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 400,
                    color: '#fff',
                    textDecoration: 'none',
                    background: isActive
                      ? 'rgba(255,255,255,0.12)'
                      : 'transparent',
                    transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Right group: email pill + burger pill ─────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{ ...PILL_STYLE, width: '55.29px', justifyContent: 'center', pointerEvents: 'auto' }}
          >
            <Link
              href="/contact"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Contact Damcraft"
            >
              <EmailPixel color="#fff" />
            </Link>
          </div>

          {/* Burger pill — mobile / tablet only */}
          <button
            type="button"
            className="nav-burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              ...PILL_STYLE,
              display: undefined, // CSS class controls visibility per breakpoint
              width: '55.29px',
              justifyContent: 'center',
              pointerEvents: 'auto',
              border: 'none',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.5px',
                background: '#fff',
                borderRadius: '1px',
                transform: menuOpen ? 'translateY(3.25px) rotate(45deg)' : 'none',
                transition: 'transform 0.25s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.5px',
                background: '#fff',
                borderRadius: '1px',
                transform: menuOpen ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
                transition: 'transform 0.25s ease',
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu overlay ─────────────────────────── */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`nav-mobile-link${pathname === href ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  )
}

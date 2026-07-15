'use client'

import { useState } from 'react'
import { ArrowRightPixel } from './Icons'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'glass' | 'dark'
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function Button({
  children,
  variant = 'glass',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11.5px 16px 11.5px 23px',
    borderRadius: 'var(--radius-btn)',
    fontSize: 'var(--size-label)',
    lineHeight: '23px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 400,
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 0.3s ease, color 0.3s ease, transform 0.2s ease',
    outline: 'none',
  }

  const variants: Record<string, React.CSSProperties> = {
    glass: {
      background: hovered ? 'rgba(255, 255, 255, 0.95)' : 'var(--color-glass-cta)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: '#000',
      // silver spotlight — white would vanish on the light glass
      ['--shine-spot' as string]: 'rgba(140, 140, 140, 0.28)',
    },
    dark: {
      background: hovered ? '#F3F3F3' : '#000',
      color: hovered ? '#000' : '#fff',
      minWidth: '177px',
      justifyContent: 'space-between',
      // spotlight flips to silver when the surface goes light
      ['--shine-spot' as string]: hovered
        ? 'rgba(140, 140, 140, 0.28)'
        : 'rgba(255, 255, 255, 0.35)',
    },
  }

  const arrowColor = variant === 'dark' ? (hovered ? '#000' : '#fff') : '#000'

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...variants[variant], opacity: disabled ? 0.55 : 1 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group cta-shine ${className}`}
    >
      {children}
      <ArrowRightPixel color={arrowColor} />
    </button>
  )
}

import { ArrowRightPixel } from './Icons'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'glass' | 'dark'
  onClick?: () => void
  className?: string
}

export default function Button({ children, variant = 'glass', onClick, className = '' }: ButtonProps) {
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
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    outline: 'none',
  }

  const variants: Record<string, React.CSSProperties> = {
    glass: {
      background: 'var(--color-glass-cta)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: '#000',
      // silver spotlight — white would vanish on the light glass
      ['--shine-spot' as string]: 'rgba(140, 140, 140, 0.28)',
    },
    dark: {
      background: '#000',
      color: '#fff',
      minWidth: '177px',
      justifyContent: 'space-between',
    },
  }

  return (
    <button
      type="button"
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      className={`group cta-shine ${className}`}
    >
      {children}
      <ArrowRightPixel color={variant === 'dark' ? '#fff' : '#000'} />
    </button>
  )
}

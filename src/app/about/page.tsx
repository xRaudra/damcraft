import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'We are Damcraft — a design and technology studio based in Italy.',
}

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        paddingTop: 'calc(var(--nav-top) + var(--nav-pill-height) + 24px)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: '15.4px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '24px',
          }}
        >
          About
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.2,
          }}
        >
          Coming Soon
        </h1>
      </div>
    </div>
  )
}

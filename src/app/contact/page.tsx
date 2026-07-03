import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Let's build something extraordinary together.",
}

export default function ContactPage() {
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
          Contact
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}
        >
          Let&apos;s build something<br />extraordinary.
        </h1>
        <a
          href="mailto:hello@damcraft.com"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '18px',
            color: 'var(--color-text-muted)',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          hello@damcraft.com
        </a>
      </div>
    </div>
  )
}

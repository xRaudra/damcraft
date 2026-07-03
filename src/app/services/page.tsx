import type { Metadata } from 'next'
import Services from '@/components/sections/Services'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Full-service brand strategy, identity, UX design, web development and more.',
}

export default function ServicesPage() {
  return (
    <div style={{ paddingTop: 'calc(var(--nav-top) + var(--nav-pill-height) + 24px)' }}>
      <Services />
    </div>
  )
}

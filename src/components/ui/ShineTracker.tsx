'use client'

import { useEffect } from 'react'

// Feeds cursor position into .cta-shine elements as --mx / --my
// so the spotlight layer follows the pointer. One passive listener
// for the whole app — no per-element handlers.
export default function ShineTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null
      const el = target?.closest?.('.cta-shine') as HTMLElement | null
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  return null
}

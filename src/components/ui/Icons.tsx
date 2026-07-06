// Pixel dot-matrix icons — matching Figma's aesthetic exactly

interface IconProps {
  className?: string
  color?: string
}

// Pixel ">" chevron — used in CTA buttons (5 dots in a right-pointing V)
export function ArrowRightPixel({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="1"  width="2.5" height="2.5" fill={color} />
      <rect x="4.5" y="3.5" width="2.5" height="2.5" fill={color} />
      <rect x="7" y="6"  width="2.5" height="2.5" fill={color} />
      <rect x="4.5" y="8.5" width="2.5" height="2.5" fill={color} />
      <rect x="2" y="11" width="2.5" height="2.5" fill={color} />
    </svg>
  )
}

// Pixel "v" chevron — used in scroll indicator (5 dots in a downward-pointing V)
export function ArrowDownPixel({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg
      width="15"
      height="10"
      viewBox="0 0 15 10"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="0"   y="0"   width="2.5" height="2.5" fill={color} />
      <rect x="2.5" y="2.5" width="2.5" height="2.5" fill={color} />
      <rect x="5"   y="5"   width="2.5" height="2.5" fill={color} />
      <rect x="7.5" y="2.5" width="2.5" height="2.5" fill={color} />
      <rect x="10"  y="0"   width="2.5" height="2.5" fill={color} />
    </svg>
  )
}

// Pixel email / envelope icon — dot-matrix style
export function EmailPixel({ className = '', color = 'currentColor' }: IconProps) {
  // 7 cols × 5 rows dot grid forming an envelope
  const size = 3
  const gap = 3.75
  const dots = [
    // Top border
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    // Left + right sides
    [0,1],[6,1],
    // Diagonal V (letter flap)
    [1,1],[5,1],[2,2],[4,2],[3,2],
    // Left + right sides
    [0,2],[6,2],
    [0,3],[6,3],
    // Bottom border
    [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
  ]
  const w = 6 * gap + size
  const h = 4 * gap + size
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {dots.map(([col, row], i) => (
        <rect
          key={i}
          x={col * gap}
          y={row * gap}
          width={size}
          height={size}
          fill={color}
        />
      ))}
    </svg>
  )
}

// ─── Service pictogram icons ─────────────────────────────────
// Dot-matrix pictograms, one per service, authored on a 7×7 grid
// (coordinates 3–9 on both axes).

const SERVICE_GLYPHS: Record<string, [number, number][]> = {
  // crosshair / compass — positioning and direction
  'brand-strategy': [
    [6, 3], [6, 5], [6, 6], [6, 7], [6, 9],
    [3, 6], [5, 6], [7, 6], [9, 6],
  ],
  // gem / diamond — the crafted mark
  'brand-identity': [
    [6, 4], [5, 5], [7, 5], [4, 6], [8, 6], [5, 7], [7, 7], [6, 8],
  ],
  // wireframe layout — header, content blocks, footer
  'user-experience-design': [
    [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
    [4, 6], [5, 6], [7, 6], [8, 6],
    [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
  ],
  // camera — photography and campaign shoots
  'visual-content': [
    [5, 4], [6, 4],
    [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
    [4, 6], [6, 6], [8, 6],
    [4, 7], [8, 7],
    [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
  ],
  // code brackets < >
  'web-development': [
    [5, 4], [4, 5], [3, 6], [4, 7], [5, 8],
    [7, 4], [8, 5], [9, 6], [8, 7], [7, 8],
  ],
  // shopping bag
  ecommerce: [
    [6, 3], [5, 4], [7, 4],
    [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
    [4, 6], [8, 6],
    [4, 7], [8, 7],
    [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
  ],
  // phone with home button
  'web-mobile-applications': [
    [5, 3], [6, 3], [7, 3],
    [5, 4], [7, 4],
    [5, 5], [7, 5],
    [5, 6], [7, 6],
    [5, 7], [6, 7], [7, 7],
    [5, 8], [6, 8], [7, 8],
  ],
  // CPU chip with pins — embedded systems and hardware
  'embedded-hardware': [
    [5, 3], [7, 3],
    [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
    [3, 5], [4, 5], [8, 5], [9, 5],
    [4, 6], [6, 6], [8, 6],
    [3, 7], [4, 7], [8, 7], [9, 7],
    [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
    [5, 9], [7, 9],
  ],
}

interface ServicePixelIconProps extends IconProps {
  serviceId: string
}

export function ServicePixelIcon({ serviceId, className = '', color = 'rgba(255,255,255,0.9)' }: ServicePixelIconProps) {
  const size = 4.2
  const gap = 5.4
  const w = 6 * gap + size // 7×7 grid
  // glyphs are authored at coords 3–9 — shift to origin
  const dots = (SERVICE_GLYPHS[serviceId] ?? []).map(
    ([x, y]) => [x - 3, y - 3] as [number, number],
  )
  return (
    <svg
      width={w}
      height={w}
      viewBox={`0 0 ${w} ${w}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {dots.map(([col, row], i) => (
        <rect
          key={i}
          x={col * gap}
          y={row * gap}
          width={size}
          height={size}
          fill={color}
        />
      ))}
    </svg>
  )
}

// Damcraft logo mark — official brand SVG
export function DamcraftLogoMark({ className = '', color = '#fff' }: IconProps) {
  return (
    <svg
      width="32"
      height="26.3"
      viewBox="66 90 268 220"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="117.5 309.88 139.93 309.88 143.31 309.88 130.56 271.33 117.5 309.88"
        fill={color}
      />
      <polygon
        points="219.29 286.36 219.29 309.88 222.47 309.88 231.01 309.88 219.29 286.36"
        fill={color}
      />
      <polygon
        points="280.14 309.88 280.14 286.36 268.42 309.88 280.14 309.88"
        fill={color}
      />
      <path
        d="M204.62,90.12h-9.24c-71.33,0-129.15,57.82-129.15,129.15v90.61h28.41l24.55-67.29h22.74l24.55,67.29h27.61v-67.31h27.35l28.27,57.01,28.43-57.01h27.2v67.31h28.42v-90.61c0-71.33-57.82-129.15-129.15-129.15Z"
        fill={color}
      />
    </svg>
  )
}

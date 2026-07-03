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

// Damcraft wordmark "D" — clean geometric lettermark for the logo pill
export function DamcraftLogoMark({ className = '' }: IconProps) {
  return (
    <svg
      width="28"
      height="31"
      viewBox="0 0 28 31"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Geometric "D" lettermark */}
      <path
        d="M2 2H10C18.837 2 26 8.163 26 15.5C26 22.837 18.837 29 10 29H2V2Z"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M7 8H10C15.523 8 20 11.358 20 15.5C20 19.642 15.523 23 10 23H7V8Z"
        fill="white"
      />
    </svg>
  )
}

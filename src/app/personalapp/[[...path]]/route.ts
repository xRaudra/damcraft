const RETIRED_PAGE = '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title></title></head><body></body></html>'

export const dynamic = 'force-dynamic'

/** Keep retired Personal App URLs outside the marketing site's shared layout. */
export function GET() {
  return new Response(RETIRED_PAGE, {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

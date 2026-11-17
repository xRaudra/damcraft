const EMPTY_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"><title></title></head><body></body></html>`;

export const dynamic = 'force-dynamic';

function respond(request) {
  const isHome = new URL(request.url).pathname === '/';
  const isPageRequest = request.method === 'GET' || request.method === 'HEAD';

  return new Response(EMPTY_PAGE, {
    status: isHome && isPageRequest ? 200 : 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const GET = respond;
export const HEAD = respond;
export const POST = respond;
export const PUT = respond;
export const PATCH = respond;
export const DELETE = respond;
export const OPTIONS = respond;

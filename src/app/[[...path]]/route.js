const NOT_FOUND = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Damcraft</title><link rel="icon" type="image/svg+xml" href="/assets/favicon-d-ribbon-dark.svg"><link rel="stylesheet" href="/assets/accessibility.css"><style>body{margin:0;background:#080808;color:#eee;font:18px/1.6 Arial,sans-serif;display:grid;place-items:center;min-height:100svh}main{max-width:600px;padding:32px}h1{font-weight:400;font-size:clamp(40px,6vw,72px);line-height:1.05}p{color:#aaa}a{color:#eee;margin-right:24px;text-underline-offset:6px}img{width:39px;height:43px}</style></head><body><main><a href="/" aria-label="Damcraft home"><img src="/assets/logo-d-ribbon.svg" alt="Damcraft"></a><h1>This page isn’t here.</h1><p>Let’s get you back to something useful.</p><a href="/">Back to home ↗</a><a href="/contact">Get in touch ↗</a></main></body></html>`;

export function GET() {
  return new Response(NOT_FOUND, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

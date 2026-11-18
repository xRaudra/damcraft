# Accessibility implementation and verification

Damcraft targets WCAG 2.2 Level AA across its 61 public pages and the custom 404 page. This is an implementation and test record, not an independent certification or a blanket conformance claim.

## Implemented

- English language, descriptive document titles, a main landmark and one page heading, logical subsection headings, and a first-focus skip link on every content page.
- Native links/buttons and explicit labels. Decorative SVGs, background artwork and the 3D emblem are excluded from assistive-technology navigation. The silent design reel has a text description.
- Opaque navigation and darker image overlays, readable secondary text, higher-contrast form boundaries, two-color keyboard focus indicators and forced-colors support.
- Services opens with Down Arrow or Space and dismisses with Escape. The full-screen menu uses a named modal dialog, isolates background content, traps focus among visible controls and restores focus on dismissal. Services remains a text link without an additional dropdown button.
- At least 24 CSS-pixel targets, with 44-pixel form buttons and media controls. Focus scroll margins protect content from the fixed header. Narrow process cards stack instead of requiring horizontal scrolling.
- Explicit required/optional form instructions, autocomplete, linked field-level errors, invalid state, live delivery status, preserved input after errors and no form navigation on focus/change. No authentication, CAPTCHA, timed session or repeated data-entry flow is present.
- Pause/play controls for the reel and animated emblem. System reduced-motion settings use static artwork and disable entrances/tilt; small screens use a static reel poster. Media has no audio. No dragging, multipoint gestures or device motion is needed.

## Repeatable checks

Install dependencies and a Chromium executable, build, then start the server. The test scripts default to `http://127.0.0.1:4317` and `/usr/bin/chromium`; override `A11Y_BASE_URL` and `CHROMIUM_PATH` as needed.

```sh
npm ci
npm run build
npm start -- --hostname 127.0.0.1 --port 4317
# In another terminal:
npm run test:a11y
npm run test:a11y:flows
```

`test:a11y` runs axe-core 4.11 on all 61 pages at 1280- and 320-pixel widths using WCAG A/AA tags through 2.2 plus best practices, checks landmarks/headings, page errors and document overflow, and writes `a11y-reports/audit.json` (ignored by Git). `test:a11y:flows` checks skip navigation, menu trap/Escape/focus restoration, expanded navigation, linked validation errors, error correction, status feedback and retained data, plus 640/320-pixel text-spacing reflow. Delivery responses are intercepted locally: the test never sends email.

## Manual review and limits

Keyboard and accessibility-tree reviews cover the main navigation, full-screen menu, contact form and skip link. Image-backed text uses a dark overlay because automatic contrast checks cannot reliably measure photographs. The black/white focus ring remains visible on both light and dark backgrounds.

Automated tests cover only part of WCAG. Before claiming formal conformance, complete an independent review with NVDA/Firefox, VoiceOver/Safari and mobile assistive technology, including browser zoom, text spacing, content descriptions, reading order, image contrast and focus visibility throughout all interaction states. Recheck whenever content, imagery or shared templates change. The visitor's external email application is outside this site's scope.

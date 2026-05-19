# Damcraft — Design Reference
Synthesized from 8 reference websites + Damcraft brand identity.
Use this as the single source of truth when building damcraft.com.

---

## 01 — Brand Tokens

### Colors
```
--chalk:  #FAFAF8   Base / page background
--ivory:  #F3EBE1   Surface / card backgrounds
--forge:  #FF5300   Primary accent — CTAs, links, logo
--ember:  #FF8D60   Secondary warm — tags, hover, tints
--walnut: #4A3530   Body text, icons
--pitch:  #1A0E08   Headings, dark sections, footer
```

### Gradients
```
Forge Fire  (dark hero, footer): linear-gradient(135deg, #1A0E08 0%, #FF5300 100%)
Ember Sunrise (buttons, tags):   linear-gradient(135deg, #FF8D60 0%, #FF5300 100%)
```

### Typography
```
Display / Headings: Raleway 700, 800
Body / UI:          DM Sans 400, 500, 600
Mono:               JetBrains Mono 400
```

### Type Scale (rem)
```
xs:   0.75rem   12px   Labels, captions
sm:   0.875rem  14px   Small body, meta
base: 1rem      16px   Body
lg:   1.125rem  18px   Large body
xl:   1.25rem   20px   Sub-headings
2xl:  1.5rem    24px   Section labels
3xl:  1.875rem  30px   Card titles
4xl:  2.25rem   36px   Section headings
5xl:  3rem      48px   Large headings
6xl:  3.75rem   60px   Hero sub-headline
7xl:  4.5rem    72px   Hero headline (mobile)
8xl:  6rem      96px   Hero headline (desktop)
```

### Spacing Scale
```
4px   0.25rem   Micro gap
8px   0.5rem    Icon padding
12px  0.75rem   Tag padding
16px  1rem      Base unit
24px  1.5rem    Component gap
32px  2rem      Section inner padding
48px  3rem      Component spacing
64px  4rem      Section gap (mobile)
80px  5rem      Section gap
96px  6rem      Section gap (desktop)
128px 8rem      Hero padding
```

---

## 02 — Layout Patterns

### Page Grid
- Max content width: 1280px
- Side padding: 24px (mobile) / 48px (tablet) / 80px (desktop)
- Column system: 12-column grid

### Section Rhythm
Every section follows this structure:
```
[Section label]     — mono, small, Forge color, letter-spaced
[Headline]          — Raleway 800, large
[Subtext]           — DM Sans 400, Walnut color, 60–70% width
[Content / Grid]
[Optional CTA]
```

### Section Numbering (seen in 7/8 references)
Label sections with zero-padded numbers:
```
01  —  Hero
02  —  Services
03  —  Work / Portfolio
04  —  Process
05  —  About
06  —  Testimonials
07  —  CTA
```

---

## 03 — Navigation

### Structure (seen across all 8 references)
```
[Logo]                    [Nav links]                [CTA button]
Dam Craft                 Work  Services  About       Let's Talk →
```

- Sticky on scroll, blurs background slightly
- Transparent on hero, solid on scroll
- Mobile: hamburger → full-screen overlay or slide-in drawer
- CTA button: Forge orange, Raleway 600, pill shape

### Nav Links
```
Work
Services
About
Blog (optional)
```

### Footer Structure
```
[Logo + tagline]          [Links col 1]    [Links col 2]    [Contact]
"We don't decorate.       Work             Privacy Policy   hello@damcraft.com
 We construct."           Services         Terms            +91 93353 55931
                          About            Sitemap          Noida, UP, India
[Social icons]
```

---

## 04 — Hero Section

### Pattern (synthesized from all 8)
```
[Eyebrow label]         — mono text, Forge, letter-spaced
[Headline]              — Raleway 800, 72–96px, Pitch
[Sub-headline]          — DM Sans 400, 18–20px, Walnut, max 560px width
[CTA row]               — Primary button + Secondary link
[Trust signal]          — Client count, star rating, or scrolling logo strip
[Visual]                — 3D/interactive element, video loop, or hero image
```

### Hero Copy Direction
```
Eyebrow:    "Design Agency · Noida, India"
Headline:   "We Build Brands That Last."
Sub:        "Logo design, websites, and digital products — crafted with
             precision for businesses that want to be remembered."
CTA 1:      "See Our Work"  (Forge button)
CTA 2:      "Let's Talk →"  (text link, Walnut)
```

### Hero Visual Options (for Three.js build)
- Floating 3D arch mark that reacts to cursor
- Particle field that forms the logo on load
- Abstract geometric construction animation (bricks/structure building)
- Smooth gradient mesh background (Pitch → Forge)

---

## 05 — Services Section

### Card Pattern (seen in 6/8 references)
```
[Number]    01
[Icon]      optional SVG
[Title]     Logo Design
[Body]      2–3 lines describing the service
[Link]      "Learn more →"
```

### Services List (Damcraft)
```
01  Logo & Brand Identity
02  Website Design & Development
03  App Design (UI/UX)
04  Brand Guidelines
```

### Layout
- 2-column grid on desktop, 1-column on mobile
- Cards: Ivory background, 16px border-radius, subtle shadow
- Hover: slight lift (translateY -4px), Forge accent on top border

---

## 06 — Portfolio / Work Section

### Card Pattern (seen in all 8 references)
```
[Image / Mockup]         — 16:9 or 4:3 ratio
[Year]                   — mono, small, Walnut
[Title]                  — Raleway 700
[Tags]                   — pill chips: "Branding" "Web Design"
[Arrow link]             → view case study
```

### Layout
- 2-column masonry or alternating full-width + 2-column
- Hover: image scale 1.03, overlay with project name fades in
- Filter tabs: All / Branding / Web / App

---

## 07 — Process Section

### Pattern (seen in 5/8 references)
Horizontal numbered steps or vertical timeline:
```
01  Discover    Brief, goals, audience research
02  Design      Concepts, iterations, feedback
03  Build       Development, QA, performance
04  Launch      Deploy, handoff, support
```

- Numbers in Forge orange
- Connecting line between steps (dashed or solid Ember)

---

## 08 — Testimonials Section

### Card Pattern (seen in 7/8 references)
```
[Quote]         "Damcraft delivered exactly what we needed — a brand
                 that actually looks like us."
[Stars]         ★★★★★
[Name]          Rahul Mehta
[Role]          Founder, BrandCo
[Logo]          client company logo (optional)
```

### Layout
- Horizontal scroll carousel (auto-scroll with pause on hover)
- Or: 3-column grid on desktop

---

## 09 — Stats / Numbers Section

### Pattern (seen in 6/8 references)
```
[Number]        [Label]
40+             Projects Delivered
15+             Happy Clients
3+              Years of Experience
100%            Client Satisfaction
```

- Numbers in Raleway 800, large
- Labels in DM Sans 400
- Separated by subtle vertical dividers
- Count-up animation on scroll into view

---

## 10 — CTA Section

### Pattern (seen in all 8 references)
Full-width dark section with centered content:
```
Background:     Forge Fire gradient (Pitch → Forge)
Headline:       "Ready to build something that lasts?"
Sub:            "Let's talk about your project."
CTA:            "Start a Project →"  (white button on dark bg)
```

---

## 11 — Button System

### Primary
```
Background:   #FF5300 (Forge) or Ember Sunrise gradient
Text:         #FAFAF8 (Chalk)
Font:         Raleway 600, 15px, letter-spacing 0.02em
Padding:      14px 28px
Radius:       8px
Hover:        darken 8%, slight scale 1.02
```

### Secondary (outlined)
```
Background:   transparent
Border:       1.5px solid #FF5300
Text:         #FF5300
Hover:        fill Forge, text Chalk
```

### Ghost (text link)
```
Text:         #4A3530 (Walnut)
Arrow:        → appended
Hover:        text shifts to Forge, arrow moves right 4px
```

---

## 12 — Interaction & Animation Principles
(Observed across all 8 references — especially Agenzo, Agero, Synthesis)

### Motion Rules
```
Duration:     200ms (micro) / 400ms (component) / 600ms (page)
Easing:       cubic-bezier(0.16, 1, 0.3, 1)  — snappy ease-out
Scroll:       fade-up + slight translateY(24px → 0) on enter
Hover cards:  translateY(-4px), shadow deepens
Buttons:      scale(1.02), color shift
```

### Three.js / WebGL Direction
- Keep it purposeful — animation should feel engineered, not decorative
- Cursor-reactive depth / parallax on hero
- Smooth, no jank — 60fps target
- Reduce motion: respect `prefers-reduced-motion`

### Libraries to Consider
```
three.js          3D hero element
@react-three/fiber  React wrapper for Three.js
framer-motion     Page transitions, scroll animations
gsap              Complex timeline animations
lenis             Smooth scroll
```

---

## 13 — Page Structure (Full)

Recommended section order for damcraft.com homepage:

```
01  Nav
02  Hero              — headline, CTA, 3D visual
03  Marquee strip     — scrolling client logos or service keywords
04  Services          — 4 service cards
05  Work              — portfolio grid (3–4 projects)
06  Process           — 4-step numbered flow
07  About             — short studio story + founder photo
08  Testimonials      — carousel
09  Stats             — 4 key numbers
10  CTA               — dark gradient section, "Start a Project"
11  Footer
```

---

## 14 — Copy Principles
(Extracted from reference site tone analysis)

- **Lead with outcome, not process** — "A brand that gets remembered" not "We do logo design"
- **Short sentences** — Damcraft voice: Confident (not arrogant) · Precise (not cold)
- **No fluff** — Every line earns its place
- **Numbers add trust** — Use real stats wherever possible
- **CTAs are specific** — "See Our Work" beats "Learn More"

### Tone Examples
```
✓  "We build brands. Not just logos."
✓  "Precision, by design."
✓  "Your brand is the first thing clients see. Make it count."
✗  "We are a passionate team of creative professionals..."
✗  "Our holistic approach to design..."
```

---

## 15 — What Makes These 8 References Work

| Pattern | Found in | Apply to Damcraft |
|---|---|---|
| Numbered sections (01, 02...) | 7/8 sites | Yes — use as section labels |
| Dark CTA section at bottom | 8/8 sites | Yes — Forge Fire gradient |
| Horizontal scrolling logos/testimonials | 6/8 sites | Yes — client/testimonial strip |
| Large hero type, short tagline | 8/8 sites | Yes — "We Build Brands That Last." |
| Numbered process steps | 5/8 sites | Yes — 4-step Discover→Launch |
| Project cards with year + tags | 8/8 sites | Yes — portfolio grid |
| Sticky transparent nav | 7/8 sites | Yes — blur on scroll |
| Count-up number stats | 6/8 sites | Yes — Projects, Clients, Years |
| Arrow link pattern (→) | 7/8 sites | Yes — ghost button style |
| Minimal footer with tagline | 8/8 sites | Yes — "We don't decorate. We construct." |

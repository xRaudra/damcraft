"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const megaServices = [
  { label: "Brand Identity", sub: "Logo, visual systems & guidelines", count: "/4 deliverables", href: "/services/brand-identity" },
  { label: "UI / UX Design", sub: "Web, mobile & design systems", count: "/3 deliverables", href: "/services/ui-ux" },
  { label: "Product Design", sub: "Strategy, wireframes, high-fidelity", count: "/3 deliverables", href: "/services/product-design" },
  { label: "Interior Design", sub: "Commercial spaces, spatial branding", count: "/3 deliverables", href: "/services/interior-design" },
];

const links = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services", hasMega: true },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo mark */}
        <Link
          href="/"
          style={{
            width: "44px",
            height: "44px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <svg width="22" height="20" viewBox="0 0 220 180.71" fill="none">
            <path fill="#FF5300" d="M113.8,0h-7.6C47.55,0,0,47.55,0,106.2v74.51h23.36l20.18-55.33h18.7l20.18,55.33h22.71v-55.35h22.49l23.25,46.88,23.38-46.88h22.37v55.35h23.37v-74.51C220,47.55,172.45,0,113.8,0Z" />
            <polygon fill="#FF5300" points="42.16 180.71 60.6 180.71 63.38 180.71 52.9 149.01 42.16 180.71" />
            <polygon fill="#FF5300" points="125.86 161.38 125.86 180.71 128.48 180.71 135.5 180.71 125.86 161.38" />
            <polygon fill="#FF5300" points="175.9 180.71 175.9 161.38 166.26 180.71 175.9 180.71" />
          </svg>
        </Link>

        {/* Center pill nav — desktop only */}
        <nav
          className="nav-desktop"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "100px",
            padding: "12px 36px",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {links.map((l) =>
            l.hasMega ? (
              <div key={l.label} onMouseEnter={openMega} onMouseLeave={closeMega}>
                <Link
                  href={l.href}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: megaOpen ? "#FAFAF8" : "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "color 0.2s",
                  }}
                >
                  {l.label}
                  <span
                    style={{
                      fontSize: "9px",
                      opacity: 0.55,
                      display: "inline-block",
                      transition: "transform 0.2s",
                      transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▾
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FAFAF8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* Right CTA — desktop only */}
        <Link
          href="/contact"
          className="nav-desktop-cta"
          style={{
            fontFamily: "Raleway, sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.02em",
            background: "#FF5300",
            color: "#FAFAF8",
            padding: "11px 22px",
            borderRadius: "100px",
            textDecoration: "none",
            display: "inline-block",
            transition: "background 0.2s, transform 0.15s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#E04900";
            (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#FF5300";
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
        >
          Let&apos;s Talk
        </Link>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            cursor: "pointer",
            padding: "0",
            flexDirection: "column",
            gap: "5px",
            width: "44px",
            height: "44px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "block", width: "20px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "transform 0.25s", transform: open ? "rotate(45deg) translate(0px, 7px)" : "" }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "opacity 0.25s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "transform 0.25s", transform: open ? "rotate(-45deg) translate(0px, -7px)" : "" }} />
        </button>
      </header>

      {/* Mega menu panel */}
      {megaOpen && (
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 49,
            width: "min(640px, calc(100vw - 48px))",
            background: "rgba(8,4,2,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,83,0,0.16)",
            borderRadius: "20px",
            padding: "8px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {megaServices.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMegaOpen(false)}
                style={{
                  display: "block",
                  padding: "24px 28px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  border: "1px solid transparent",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,83,0,0.08)";
                  el.style.borderColor = "rgba(255,83,0,0.16)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "rgba(255,83,0,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Service
                  </span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "rgba(255,83,0,0.4)", letterSpacing: "0.06em" }}>
                    {s.count}
                  </span>
                </div>
                <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "17px", color: "#FAFAF8", marginBottom: "6px", letterSpacing: "0.01em", margin: "0 0 6px 0" }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#F3EBE1", opacity: 0.4, lineHeight: 1.55, margin: 0 }}>
                  {s.sub}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile fullscreen menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#000000",
            zIndex: 49,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 8vw, 48px)",
                color: "#FAFAF8",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF5300")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#FAFAF8")}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              background: "#FF5300",
              color: "#FAFAF8",
              padding: "16px 40px",
              borderRadius: "100px",
              textDecoration: "none",
              marginTop: "16px",
            }}
          >
            Let&apos;s Talk
          </Link>
        </div>
      )}
    </>
  );
}

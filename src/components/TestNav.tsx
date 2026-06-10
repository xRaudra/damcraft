"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const megaServices = [
  { label: "Brand Identity", sub: "Logo, visual systems & guidelines", count: "/4 deliverables", href: "/test/services/brand-identity" },
  { label: "UI / UX Design", sub: "Web, mobile & design systems", count: "/3 deliverables", href: "/test/services/ui-ux" },
  { label: "Product Design", sub: "Strategy, wireframes, high-fidelity", count: "/3 deliverables", href: "/test/services/product-design" },
  { label: "Interior Design", sub: "Commercial spaces, spatial branding", count: "/3 deliverables", href: "/test/services/interior-design" },
];

const links = [
  { label: "Work", href: "/test/work" },
  { label: "Services", href: "/test/services", hasMega: true },
  { label: "About", href: "/test/about" },
  { label: "Process", href: "/test/process" },
  { label: "Contact", href: "/test/contact" },
];

export default function TestNav() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.18)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.2)" : "none",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.15)" : "none",
        transition: "background 0.35s, border-color 0.35s, box-shadow 0.35s, backdrop-filter 0.35s",
      }}
    >
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        {/* Logo */}
        <Link href="/test" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <svg width="30" height="27" viewBox="0 0 504 450" fill="none">
            <path fill="#FF5300" d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z" />
          </svg>
          <span style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "18px", color: "#FF5300", letterSpacing: "0.01em" }}>Dam Craft</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop" style={{ alignItems: "center", gap: "36px" }}>
          {links.map((l) =>
            l.hasMega ? (
              <div
                key={l.label}
                style={{ position: "relative" }}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <Link
                  href={l.href}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#F3EBE1",
                    opacity: 0.7,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {l.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="#F3EBE1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#F3EBE1",
                  opacity: 0.7,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                {l.label}
              </Link>
            )
          )}
          <Link
            href="/test/contact"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.02em",
              background: "#FF5300",
              color: "#FAFAF8",
              padding: "10px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.2s, transform 0.15s",
            }}
          >
            Let&apos;s Talk
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", flexDirection: "column", gap: "5px" }}
        >
          <span style={{ display: "block", width: "24px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "transform 0.25s", transform: mobileOpen ? "rotate(45deg) translate(0px, 7px)" : "" }} />
          <span style={{ display: "block", width: "24px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "opacity 0.25s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "24px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "transform 0.25s", transform: mobileOpen ? "rotate(-45deg) translate(0px, -7px)" : "" }} />
        </button>
      </div>

      {/* Mega menu panel */}
      {megaOpen && (
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          style={{
            position: "absolute",
            top: "72px",
            left: 0,
            right: 0,
            background: "#1A0E08",
            borderTop: "1px solid rgba(255,83,0,0.12)",
            borderBottom: "1px solid rgba(255,83,0,0.12)",
            padding: "40px 0 48px",
          }}
        >
          <div className="wrap">
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "rgba(255,83,0,0.6)", textTransform: "uppercase", marginBottom: "28px" }}>Our Services</p>
            <div className="grid-4">
              {megaServices.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  onClick={() => setMegaOpen(false)}
                  style={{ textDecoration: "none", display: "block", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,83,0,0.1)", background: "rgba(255,83,0,0.04)", transition: "background 0.2s, border-color 0.2s" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,83,0,0.09)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,83,0,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,83,0,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,83,0,0.1)";
                  }}
                >
                  <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "16px", color: "#FAFAF8", marginBottom: "6px" }}>{s.label}</p>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#F3EBE1", opacity: 0.5, lineHeight: 1.6, marginBottom: "16px" }}>{s.sub}</p>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#FF5300", letterSpacing: "0.08em" }}>{s.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#1A0E08", padding: "24px 24px 40px", display: "flex", flexDirection: "column", gap: "24px", borderTop: "1px solid rgba(255,83,0,0.12)" }}>
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "22px", color: "#FAFAF8", textDecoration: "none", letterSpacing: "0.01em" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/test/contact"
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              background: "#FF5300",
              color: "#FAFAF8",
              padding: "15px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Let&apos;s Talk
          </Link>
        </div>
      )}
    </header>
  );
}

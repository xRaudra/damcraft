"use client";
import { useEffect, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: scrolled ? "1px solid rgba(255,83,0,0.15)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.35)" : "none",
        transition: "background 0.35s, border-color 0.35s, box-shadow 0.35s",
      }}
    >
      <div
        className="wrap"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <svg width="30" height="27" viewBox="0 0 504 450" fill="none">
            <path
              fill="#FF5300"
              d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z"
            />
          </svg>
          <span style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "18px", color: "#FF5300", letterSpacing: "0.01em" }}>
            Dam Craft
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="nav-desktop" style={{ alignItems: "center", gap: "36px" }}>
          {links.map((l) => (
            <a
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
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:hello@damcraft.com"
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
              transition: "background 0.2s, transform 0.15s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#E04900";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FF5300";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Let&apos;s Talk
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", flexDirection: "column", gap: "5px" }}
        >
          <span style={{ display: "block", width: "24px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "transform 0.25s", transform: open ? "rotate(45deg) translate(0px, 7px)" : "" }} />
          <span style={{ display: "block", width: "24px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "opacity 0.25s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "24px", height: "2px", background: "#FF5300", borderRadius: "1px", transition: "transform 0.25s", transform: open ? "rotate(-45deg) translate(0px, -7px)" : "" }} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div style={{ background: "#1A0E08", padding: "24px 24px 40px", display: "flex", flexDirection: "column", gap: "24px", borderTop: "1px solid rgba(255,83,0,0.12)" }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "22px", color: "#FAFAF8", textDecoration: "none", letterSpacing: "0.01em" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:hello@damcraft.com"
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
          </a>
        </div>
      )}
    </header>
  );
}

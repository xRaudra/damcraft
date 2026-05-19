"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(26,14,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,83,0,0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg width="32" height="28" viewBox="0 0 504 450" fill="none">
            <path
              fill="#FF5300"
              d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z"
            />
          </svg>
          <span
            style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "18px", color: "#FF5300", letterSpacing: "0.02em" }}
          >
            Dam Craft
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm transition-colors duration-200"
              style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#F3EBE1", opacity: 0.75 }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.75")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="mailto:hello@damcraft.com"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              background: "#FF5300",
              color: "#FAFAF8",
              fontSize: "14px",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#E04900")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FF5300")}
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 transition-all" style={{ background: "#FF5300", transform: open ? "rotate(45deg) translate(2px,4px)" : "" }} />
          <span className="block w-6 h-0.5 transition-all" style={{ background: "#FF5300", opacity: open ? 0 : 1 }} />
          <span className="block w-6 h-0.5 transition-all" style={{ background: "#FF5300", transform: open ? "rotate(-45deg) translate(2px,-4px)" : "" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-8 pt-4 flex flex-col gap-6" style={{ background: "#1A0E08" }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-lg"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, color: "#FAFAF8" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:hello@damcraft.com"
            className="px-5 py-3 rounded-lg text-center"
            style={{ background: "#FF5300", color: "#FAFAF8", fontFamily: "Raleway, sans-serif", fontWeight: 700 }}
          >
            Let&apos;s Talk
          </a>
        </div>
      )}
    </header>
  );
}

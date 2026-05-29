"use client";
import { useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
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
        {/* Logo mark — rounded square */}
        <a
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
        </a>

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
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FAFAF8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right CTA — desktop only */}
        <a
          href="mailto:hello@damcraft.com"
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
        </a>

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

      {/* Mobile fullscreen menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "#000000",
            zIndex: 49,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {links.map((l) => (
            <a
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
              padding: "16px 40px",
              borderRadius: "100px",
              textDecoration: "none",
              marginTop: "16px",
            }}
          >
            Let&apos;s Talk
          </a>
        </div>
      )}
    </>
  );
}

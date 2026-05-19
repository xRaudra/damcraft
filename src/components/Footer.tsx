"use client";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#1A0E08", borderTop: "1px solid rgba(255,83,0,0.15)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <svg width="28" height="25" viewBox="0 0 504 450" fill="none">
              <path fill="#FF5300" d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z" />
            </svg>
            <span style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "17px", color: "#FF5300" }}>Dam Craft</span>
          </div>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.6, lineHeight: 1.7, maxWidth: "260px" }}>
            We don&apos;t decorate. We construct.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.12em", color: "#FF5300", textTransform: "uppercase", marginBottom: "8px" }}>Navigation</p>
          {["Work", "Services", "About", "Process"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.6, textDecoration: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
            >{l}</a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.12em", color: "#FF5300", textTransform: "uppercase", marginBottom: "8px" }}>Contact</p>
          <a href="mailto:hello@damcraft.com" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.6 }}>hello@damcraft.com</a>
          <a href="tel:+919335355931" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.6 }}>+91 93353 55931</a>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.6 }}>Noida, UP, India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#F3EBE1", opacity: 0.35 }}>
          © {year} Damcraft. All rights reserved.
        </p>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#F3EBE1", opacity: 0.35 }}>
          damcraft.com
        </p>
      </div>
    </footer>
  );
}

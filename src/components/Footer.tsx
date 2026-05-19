"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#1A0E08", borderTop: "1px solid rgba(255,83,0,0.12)" }}>
      <div className="wrap">
        {/* Main grid */}
        <div className="grid-3" style={{ paddingTop: "72px", paddingBottom: "56px" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <svg width="26" height="23" viewBox="0 0 504 450" fill="none">
                <path fill="#FF5300" d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z" />
              </svg>
              <span style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "17px", color: "#FF5300" }}>Dam Craft</span>
            </a>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.5, lineHeight: 1.75, maxWidth: "240px" }}>
              We don&apos;t decorate. We construct.<br />Based in Noida, India.
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.12em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
              Navigation
            </p>
            {["Work", "Services", "About", "Process"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "#F3EBE1", opacity: 0.5, textDecoration: "none", padding: "6px 0", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.12em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
              Contact
            </p>
            <a
              href="mailto:hello@damcraft.com"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "#F3EBE1", opacity: 0.5, textDecoration: "none", padding: "6px 0", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
            >
              hello@damcraft.com
            </a>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "#F3EBE1", opacity: 0.35, padding: "6px 0" }}>
              Noida, UP, India
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#F3EBE1", opacity: 0.25 }}>
            © {year} Damcraft. All rights reserved.
          </p>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#F3EBE1", opacity: 0.25 }}>
            damcraft.com
          </p>
        </div>
      </div>
    </footer>
  );
}

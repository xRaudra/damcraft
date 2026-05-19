"use client";

export default function About() {
  return (
    <section id="about" style={{ background: "#1A0E08", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>05 — About</p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#FAFAF8", lineHeight: 1.1, marginBottom: "24px" }}>
            Built on One<br />Principle
          </h2>
          <div style={{ width: "40px", height: "3px", background: "#FF5300", borderRadius: "2px", marginBottom: "32px" }} />
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "17px", color: "#F3EBE1", opacity: 0.8, lineHeight: 1.8, marginBottom: "20px" }}>
            A beaver doesn&apos;t just build a dam. It engineers an ecosystem. That&apos;s the thinking behind Damcraft — precision, natural intelligence, and purposeful construction that creates lasting systems.
          </p>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "17px", color: "#F3EBE1", opacity: 0.65, lineHeight: 1.8, marginBottom: "40px" }}>
            We are a design agency based in Noida, India. We help businesses build logos, websites, and digital products that work as hard as the people behind them. No decoration. No fluff. Just work that lasts.
          </p>
          <a
            href="mailto:hello@damcraft.com"
            style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.02em", background: "transparent", color: "#FF5300", padding: "13px 28px", borderRadius: "8px", textDecoration: "none", display: "inline-block", border: "1.5px solid #FF5300", transition: "background 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FF5300"; (e.currentTarget as HTMLElement).style.color = "#FAFAF8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#FF5300"; }}
          >
            Work With Us →
          </a>
        </div>

        {/* Visual card */}
        <div style={{ background: "rgba(255,83,0,0.07)", borderRadius: "24px", padding: "48px", border: "1px solid rgba(255,83,0,0.15)", display: "flex", flexDirection: "column", gap: "32px" }}>
          <svg width="72" height="64" viewBox="0 0 504 450" fill="none">
            <path fill="#FF5300" d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z" />
          </svg>
          <div>
            <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "28px", color: "#FAFAF8", lineHeight: 1.2, marginBottom: "12px" }}>
              &ldquo;We don&apos;t decorate.<br />We construct.&rdquo;
            </p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.5 }}>— Saurabh Pandey, Founder · Damcraft</p>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,83,0,0.15)", paddingTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[["Logo Design", "Brand Identity"], ["Website Design", "App UI/UX"]].flat().map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF5300", flexShrink: 0 }} />
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#F3EBE1", opacity: 0.7 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

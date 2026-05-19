"use client";

export default function About() {
  return (
    <section id="about" style={{ background: "#1A0E08", padding: "100px 0" }}>
      <div className="wrap">
        <div className="col-2">
          {/* Text column */}
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
              05 — About
            </p>
            <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#FAFAF8", lineHeight: 1.1, marginBottom: "24px" }}>
              Built on One<br />Principle
            </h2>
            <div style={{ width: "40px", height: "3px", background: "#FF5300", borderRadius: "2px", marginBottom: "32px" }} />
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "17px", color: "#F3EBE1", opacity: 0.8, lineHeight: 1.8, marginBottom: "20px" }}>
              A beaver doesn&apos;t just build a dam. It engineers an ecosystem — precision, natural intelligence, and purposeful construction that creates lasting systems. That&apos;s the thinking behind Damcraft.
            </p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: "#F3EBE1", opacity: 0.55, lineHeight: 1.8, marginBottom: "44px" }}>
              We are a design agency based in Noida, India. We help businesses build logos, websites, and digital products that work as hard as the people behind them.
            </p>
            <a
              href="mailto:hello@damcraft.com"
              style={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.02em",
                background: "transparent",
                color: "#FF5300",
                padding: "13px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "inline-block",
                border: "1.5px solid #FF5300",
                transition: "background 0.2s, color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#FF5300";
                el.style.color = "#FAFAF8";
                el.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "#FF5300";
                el.style.transform = "scale(1)";
              }}
            >
              Work With Us →
            </a>
          </div>

          {/* Visual card */}
          <div
            style={{
              background: "rgba(255,83,0,0.06)",
              borderRadius: "24px",
              padding: "48px 44px",
              border: "1px solid rgba(255,83,0,0.14)",
              display: "flex",
              flexDirection: "column",
              gap: "36px",
            }}
          >
            {/* Logo mark */}
            <svg width="60" height="54" viewBox="0 0 504 450" fill="none">
              <path fill="#FF5300" d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z" />
            </svg>

            {/* Quote */}
            <div>
              <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(22px, 2.5vw, 28px)", color: "#FAFAF8", lineHeight: 1.25, marginBottom: "16px" }}>
                &ldquo;We don&apos;t decorate.<br />We construct.&rdquo;
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#F3EBE1", opacity: 0.4, letterSpacing: "0.02em" }}>
                — Saurabh Pandey, Founder · Damcraft
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,83,0,0.14)" }} />

            {/* Services list */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {["Logo Design", "Brand Identity", "Website Design", "App UI/UX"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF5300", flexShrink: 0 }} />
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#F3EBE1", opacity: 0.65 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

export default function CTA() {
  return (
    <section style={{ background: "linear-gradient(135deg, #1A0E08 0%, #FF5300 100%)", padding: "120px 0", position: "relative", overflow: "hidden" }}>
      {/* Decorative ring */}
      <div style={{ position: "absolute", right: "-120px", top: "50%", transform: "translateY(-50%)", width: "480px", height: "480px", borderRadius: "50%", border: "1px solid rgba(250,250,248,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(250,250,248,0.06)", pointerEvents: "none" }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "rgba(250,250,248,0.55)", textTransform: "uppercase", marginBottom: "24px" }}>
          07 — Let&apos;s Build
        </p>
        <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 68px)", color: "#FAFAF8", lineHeight: 1.05, marginBottom: "20px" }}>
          Precision by Design.<br />Built to Last.
        </h2>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "18px", color: "#FAFAF8", opacity: 0.7, lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 52px" }}>
          Let&apos;s talk about your project. No pitch, no fluff — just a precise conversation about what you need and how we build it.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          <a
            href="mailto:hello@damcraft.com"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.02em",
              background: "#FAFAF8",
              color: "#1A0E08",
              padding: "16px 40px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Start a Project →
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

export default function CTA() {
  return (
    <section style={{ background: "linear-gradient(135deg, #1A0E08 0%, #FF5300 100%)", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "rgba(250,250,248,0.6)", textTransform: "uppercase", marginBottom: "24px" }}>
          07 — Let&apos;s Build
        </p>
        <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 68px)", color: "#FAFAF8", lineHeight: 1.05, marginBottom: "20px" }}>
          Ready to Build Something<br />That Lasts?
        </h2>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "18px", color: "#FAFAF8", opacity: 0.75, lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 48px" }}>
          Let&apos;s talk about your project. No pitch, no fluff — just an honest conversation about what you need.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@damcraft.com"
            style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.02em", background: "#FAFAF8", color: "#1A0E08", padding: "16px 40px", borderRadius: "8px", textDecoration: "none", display: "inline-block", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            Start a Project →
          </a>
          <a
            href="tel:+919335355931"
            style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "16px", color: "#FAFAF8", opacity: 0.8, textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "16px 28px", border: "1.5px solid rgba(250,250,248,0.35)", borderRadius: "8px", transition: "opacity 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(250,250,248,0.7)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(250,250,248,0.35)"; }}
          >
            +91 93353 55931
          </a>
        </div>
      </div>
    </section>
  );
}

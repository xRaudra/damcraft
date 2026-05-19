"use client";

const steps = [
  {
    num: "01",
    title: "Discover",
    body: "We start with your goals, your audience, and what makes you different. No assumptions — just sharp questions and sharper listening.",
  },
  {
    num: "02",
    title: "Design",
    body: "Concepts built on strategy, not guesswork. We iterate fast, share early, and refine until every detail earns its place.",
  },
  {
    num: "03",
    title: "Build",
    body: "Design handed off to pixel-perfect execution. Development, QA, and performance tested before anything goes live.",
  },
  {
    num: "04",
    title: "Launch",
    body: "Deploy, handoff, and you're live. We stay close post-launch — because a good agency doesn't disappear after delivery.",
  },
];

export default function Process() {
  return (
    <section id="process" style={{ background: "#F3EBE1", padding: "100px 0" }}>
      <div className="wrap">
        {/* Header */}
        <div style={{ marginBottom: "64px" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
            04 — Process
          </p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#1A0E08", lineHeight: 1.1 }}>
            How We<br />Work
          </h2>
        </div>

        {/* Steps */}
        <div className="grid-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              style={{
                padding: "40px 32px",
                borderLeft: i === 0 ? "none" : "1px solid rgba(74,53,48,0.12)",
                position: "relative",
              }}
            >
              {/* Step number */}
              <div style={{ marginBottom: "24px" }}>
                <span
                  style={{
                    fontFamily: "Raleway, sans-serif",
                    fontWeight: 900,
                    fontSize: "56px",
                    color: "#FF5300",
                    opacity: 0.15,
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {s.num}
                </span>
              </div>

              {/* Accent line */}
              <div style={{ width: "32px", height: "3px", background: "#FF5300", borderRadius: "2px", marginBottom: "20px" }} />

              <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "20px", color: "#1A0E08", marginBottom: "12px", letterSpacing: "0.01em" }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#4A3530", lineHeight: 1.75, opacity: 0.8 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid rgba(74,53,48,0.12)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: "#4A3530", opacity: 0.7, maxWidth: "400px", lineHeight: 1.7 }}>
            Ready to start your project? Let&apos;s walk through the process together.
          </p>
          <a
            href="mailto:hello@damcraft.com"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "0.02em",
              background: "#1A0E08",
              color: "#FAFAF8",
              padding: "14px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.2s, transform 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FF5300";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1A0E08";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Start Your Project →
          </a>
        </div>
      </div>
    </section>
  );
}

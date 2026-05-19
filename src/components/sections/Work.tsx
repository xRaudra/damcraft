"use client";

const projects = [
  { num: "01", year: "2026", title: "Damcraft", desc: "Full brand identity — logo mark, color system, typography, and a 13-section brand guidelines document.", tags: ["Branding", "Identity", "Guidelines"], bg: "#1A0E08", accent: "#FF5300" },
  { num: "02", year: "2025", title: "Coming Soon", desc: "Next project dropping soon. Building something precise and purposeful.", tags: ["Web Design", "UI/UX"], bg: "#F3EBE1", accent: "#4A3530" },
  { num: "03", year: "2025", title: "Coming Soon", desc: "An app design project in the works. Clean architecture, intuitive flows.", tags: ["App Design"], bg: "#FF5300", accent: "#FAFAF8" },
];

export default function Work() {
  return (
    <section id="work" style={{ background: "#1A0E08", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>03 — Work</p>
            <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#FAFAF8", lineHeight: 1.1 }}>
              Selected<br />Projects
            </h2>
          </div>
          <a href="mailto:hello@damcraft.com" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "15px", color: "#FF5300", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", paddingBottom: "4px", borderBottom: "1px solid rgba(255,83,0,0.35)" }}>
            Start a Project →
          </a>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-6">
          {projects.map((p) => (
            <div
              key={p.num}
              style={{ background: p.bg, borderRadius: "20px", padding: "clamp(32px, 4vw, 56px)", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.25s", cursor: "pointer" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: p.accent, opacity: 0.6, letterSpacing: "0.1em" }}>{p.num}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: p.accent, opacity: 0.4 }}>{p.year}</span>
                  </div>
                  <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: p.accent, lineHeight: 1.1, marginBottom: "12px" }}>{p.title}</h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: p.accent, opacity: 0.7, lineHeight: 1.65, maxWidth: "520px" }}>{p.desc}</p>
                </div>
                <span style={{ fontSize: "24px", color: p.accent, opacity: 0.4 }}>↗</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {p.tags.map((t) => (
                  <span key={t} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.06em", color: p.accent, opacity: 0.55, padding: "4px 10px", borderRadius: "4px", border: `1px solid ${p.accent}40` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

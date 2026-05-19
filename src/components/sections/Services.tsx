"use client";

const services = [
  {
    num: "01",
    title: "Brand Identity",
    body: "Logos, systems, and guidelines that hold their integrity across every surface and scale. A mark built to last.",
    tags: ["Logo", "Brand Mark", "Guidelines", "Visual System"],
  },
  {
    num: "02",
    title: "UI / UX Design",
    body: "Digital interfaces engineered for clarity and longevity. Clean architecture, intuitive flows — zero waste, zero guesswork.",
    tags: ["Web App", "Mobile", "Interaction Design"],
  },
  {
    num: "03",
    title: "Product Design",
    body: "End-to-end product design for digital platforms — from strategy and wireframes to high-fidelity, built to ship.",
    tags: ["SaaS", "Dashboard", "Product Strategy"],
  },
  {
    num: "04",
    title: "Interior Design",
    body: "Environments shaped by the same structural rigor — purposeful, lasting, unmistakable. Space as a brand statement.",
    tags: ["Commercial", "Studio", "Spatial Branding"],
  },
];

export default function Services() {
  return (
    <section id="services" style={{ background: "#FAFAF8", padding: "100px 0" }}>
      <div className="wrap">
        {/* Header */}
        <div style={{ marginBottom: "64px" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
            02 — Services
          </p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#1A0E08", lineHeight: 1.1, maxWidth: "420px" }}>
            What We<br />Construct
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid-2">
          {services.map((s) => (
            <div
              key={s.num}
              style={{
                background: "#F3EBE1",
                borderRadius: "16px",
                padding: "40px",
                border: "1px solid rgba(74,53,48,0.08)",
                transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "0 24px 56px rgba(26,14,8,0.12)";
                el.style.borderColor = "rgba(255,83,0,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "rgba(74,53,48,0.08)";
              }}
            >
              {/* Top accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #FF5300, transparent)", opacity: 0, transition: "opacity 0.25s" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#FF5300", letterSpacing: "0.1em", background: "rgba(255,83,0,0.08)", padding: "5px 10px", borderRadius: "4px" }}>{s.num}</span>
                <span style={{ fontSize: "18px", color: "#1A0E08", opacity: 0.2 }}>↗</span>
              </div>

              <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "22px", color: "#1A0E08", marginBottom: "14px", lineHeight: 1.25 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "#4A3530", lineHeight: 1.75, marginBottom: "28px", opacity: 0.85 }}>
                {s.body}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {s.tags.map((t) => (
                  <span key={t} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.06em", color: "#FF5300", background: "rgba(255,83,0,0.08)", padding: "5px 11px", borderRadius: "4px" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

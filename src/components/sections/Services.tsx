"use client";

const services = [
  {
    num: "01",
    title: "Logo & Brand Identity",
    body: "A mark that means something. We design logos and visual identities that communicate who you are before you say a word.",
    tags: ["Logo", "Brand Mark", "Guidelines"],
  },
  {
    num: "02",
    title: "Website Design & Development",
    body: "Fast, conversion-focused websites built to perform. Every pixel is intentional. Every interaction earns its place.",
    tags: ["UI Design", "Next.js", "Webflow"],
  },
  {
    num: "03",
    title: "App Design (UI / UX)",
    body: "Mobile and web apps that users actually want to use. Clean architecture, intuitive flows, zero guesswork.",
    tags: ["iOS", "Android", "Web App"],
  },
  {
    num: "04",
    title: "Brand Guidelines",
    body: "Every rule your team needs to keep the brand consistent — across every medium, every screen, every touchpoint.",
    tags: ["System Design", "Documentation"],
  },
];

export default function Services() {
  return (
    <section id="services" style={{ background: "#FAFAF8", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>02 — Services</p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#1A0E08", lineHeight: 1.1, maxWidth: "480px" }}>
            What We<br />Build For You
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.num}
              className="group"
              style={{ background: "#F3EBE1", borderRadius: "16px", padding: "36px", border: "1px solid rgba(74,53,48,0.08)", transition: "transform 0.25s, box-shadow 0.25s", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(26,14,8,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,83,0,0.25)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,53,48,0.08)"; }}
            >
              <div className="flex items-start justify-between mb-6">
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#FF5300", letterSpacing: "0.08em" }}>{s.num}</span>
                <span style={{ fontSize: "20px", opacity: 0.3 }}>→</span>
              </div>
              <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "22px", color: "#1A0E08", marginBottom: "12px", lineHeight: 1.25 }}>{s.title}</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "#4A3530", lineHeight: 1.7, marginBottom: "24px", opacity: 0.85 }}>{s.body}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.06em", background: "rgba(255,83,0,0.1)", color: "#FF5300", padding: "4px 10px", borderRadius: "4px" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

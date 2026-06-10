import Link from "next/link";

const deliverables = [
  { title: "Logo Design", body: "A primary mark, secondary lockup, and monogram — each tested across dark, light, and scaled-down applications." },
  { title: "Visual Identity System", body: "Color palette, typography scale, iconography rules, and pattern language documented to hold at every surface." },
  { title: "Brand Guidelines", body: "A 9-section reference document covering usage, spacing, do/don'ts, and reproduction specs for every output format." },
  { title: "Typography System", body: "Primary and secondary typefaces selected for longevity — not trend — with hierarchy rules for every context." },
];

export default function BrandIdentityPage() {
  return (
    <main style={{ paddingTop: "76px" }}>
      <section style={{ background: "#1A0E08", padding: "80px 0 100px" }}>
        <div className="wrap">
          <Link href="/test/services" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,83,0,0.6)", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
            ← All Services
          </Link>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "20px" }}>Service — Brand Identity</p>
          <h1 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(40px, 5.5vw, 72px)", color: "#FAFAF8", lineHeight: 1.05, marginBottom: "24px", maxWidth: "700px" }}>
            A mark built<br /><span style={{ color: "#FF5300" }}>to last.</span>
          </h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(16px, 1.8vw, 19px)", color: "#F3EBE1", opacity: 0.6, lineHeight: 1.8, maxWidth: "520px" }}>
            Logos, systems, and guidelines that hold their integrity across every surface and scale — from billboard to favicon.
          </p>
        </div>
      </section>

      <section style={{ background: "#FAFAF8", padding: "96px 0" }}>
        <div className="wrap">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>What&apos;s Included</p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1A0E08", lineHeight: 1.1, marginBottom: "64px" }}>4 Core Deliverables</h2>
          <div className="grid-2">
            {deliverables.map((d, i) => (
              <div key={d.title} style={{ background: "#F3EBE1", borderRadius: "16px", padding: "40px", border: "1px solid rgba(74,53,48,0.08)" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#FF5300", letterSpacing: "0.1em", background: "rgba(255,83,0,0.08)", padding: "5px 10px", borderRadius: "4px", display: "inline-block", marginBottom: "24px" }}>0{i + 1}</span>
                <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "20px", color: "#1A0E08", marginBottom: "12px" }}>{d.title}</h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "#4A3530", lineHeight: 1.75, opacity: 0.85 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#1A0E08", padding: "96px 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#FAFAF8", marginBottom: "20px" }}>Ready to build your brand?</h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "17px", color: "#F3EBE1", opacity: 0.55, lineHeight: 1.75, maxWidth: "420px", margin: "0 auto 40px" }}>No pitch, no fluff — just an honest conversation about what you need.</p>
          <Link href="/test/contact" style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "16px", background: "#FF5300", color: "#FAFAF8", padding: "16px 40px", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}>
            Start a Brand Identity Project →
          </Link>
        </div>
      </section>
    </main>
  );
}

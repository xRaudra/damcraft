const steps = [
  { num: "01", title: "Discover", body: "We start with your goals, your audience, and what makes you different. No assumptions — just sharp questions and sharper listening." },
  { num: "02", title: "Design", body: "Concepts built on strategy, not guesswork. We iterate fast, share early, and refine until every detail earns its place." },
  { num: "03", title: "Build", body: "Design handed off to pixel-perfect execution. Development, QA, and performance tested before anything goes live." },
  { num: "04", title: "Launch", body: "Deploy, handoff, and you're live. We stay close post-launch — because a good agency doesn't disappear after delivery." },
];

export default function Process() {
  return (
    <section id="process" style={{ background: "#F3EBE1", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>04 — Process</p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#1A0E08", lineHeight: 1.1 }}>
            How We<br />Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <div key={s.num} style={{ padding: "36px 28px", borderLeft: i === 0 ? "none" : "1px solid rgba(74,53,48,0.12)", position: "relative" }}>
              <div style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "40px", color: "#FF5300", opacity: 0.2, lineHeight: 1, marginBottom: "20px" }}>{s.num}</div>
              <div style={{ width: "28px", height: "3px", background: "#FF5300", borderRadius: "2px", marginBottom: "20px" }} />
              <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "20px", color: "#1A0E08", marginBottom: "12px" }}>{s.title}</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#4A3530", lineHeight: 1.7, opacity: 0.85 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "40+", label: "Projects Delivered" },
  { value: "15+", label: "Happy Clients" },
  { value: "3+", label: "Years of Experience" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function Stats() {
  return (
    <section style={{ background: "#FAFAF8", padding: "80px 0", borderTop: "1px solid rgba(74,53,48,0.08)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((s, i) => (
            <div key={s.label} style={{ padding: "32px 24px", borderLeft: i === 0 ? "none" : "1px solid rgba(74,53,48,0.1)", textAlign: "center" }}>
              <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4vw, 52px)", color: "#FF5300", lineHeight: 1, marginBottom: "10px" }}>{s.value}</p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#4A3530", opacity: 0.7, letterSpacing: "0.02em" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

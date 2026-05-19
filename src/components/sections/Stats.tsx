"use client";

const stats = [
  { value: "40+", label: "Projects Delivered" },
  { value: "15+", label: "Happy Clients" },
  { value: "3+", label: "Years Active" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function Stats() {
  return (
    <section style={{ background: "#FAFAF8", borderTop: "1px solid rgba(74,53,48,0.08)", borderBottom: "1px solid rgba(74,53,48,0.08)" }}>
      <div className="wrap">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "56px 32px",
                textAlign: "center",
                borderLeft: i === 0 ? "none" : "1px solid rgba(74,53,48,0.08)",
              }}
            >
              <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 900, fontSize: "clamp(40px, 5vw, 60px)", color: "#FF5300", lineHeight: 1, marginBottom: "10px", letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#4A3530", opacity: 0.6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

const items = ["Logo Design", "Website Design", "App Design", "Brand Identity", "UI / UX", "Digital Products", "Visual Systems", "Motion Design"];

export default function Marquee() {
  const repeated = [...items, ...items];
  return (
    <div style={{ background: "#FF5300", overflow: "hidden", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ display: "flex", gap: "0", animation: "marquee 28s linear infinite", width: "max-content" }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#FAFAF8", padding: "0 32px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "32px" }}>
            {item}
            <span style={{ opacity: 0.5, fontSize: "8px" }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

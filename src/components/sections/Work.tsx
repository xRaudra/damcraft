"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    num: "01",
    year: "2024",
    title: "Damcraft",
    desc: "Complete brand identity system — logo mark, color palette, typography scale, and a 9-section brand guidelines document engineered to hold at every scale.",
    tags: ["Brand Identity", "Logo", "Guidelines"],
    bg: "#1A0E08",
    accent: "#FF5300",
    textColor: "#FAFAF8",
  },
  {
    num: "02",
    year: "2025",
    title: "In the Works",
    desc: "A UI/UX and product design project currently in progress. Structural thinking applied to a digital platform.",
    tags: ["UI/UX Design", "Product Design"],
    bg: "#F3EBE1",
    accent: "#4A3530",
    textColor: "#1A0E08",
  },
  {
    num: "03",
    year: "2025",
    title: "In the Works",
    desc: "Interior and brand identity project — applying the same structural rigor to physical space.",
    tags: ["Interior Design", "Brand Identity"],
    bg: "#FF5300",
    accent: "#FAFAF8",
    textColor: "#FAFAF8",
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".work-header", {
        scrollTrigger: { trigger: ".work-header", start: "top 85%" },
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.utils.toArray<HTMLElement>(".work-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          y: 50,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" style={{ background: "#1A0E08", padding: "100px 0" }}>
      <div className="wrap">
        <div className="work-header" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", marginBottom: "56px" }}>
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
              03 — Work
            </p>
            <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#FAFAF8", lineHeight: 1.1 }}>
              Selected<br />Work
            </h2>
          </div>
          <a
            href="mailto:hello@damcraft.com"
            style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "14px", color: "#FF5300", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", paddingBottom: "3px", borderBottom: "1px solid rgba(255,83,0,0.4)", transition: "border-color 0.2s, gap 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#FF5300"; (e.currentTarget as HTMLElement).style.gap = "12px"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,83,0,0.4)"; (e.currentTarget as HTMLElement).style.gap = "6px"; }}
          >
            Start a Project →
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {projects.map((p) => (
            <div
              key={p.num}
              className="work-card"
              style={{
                background: p.bg,
                borderRadius: "20px",
                padding: "clamp(32px, 4vw, 52px)",
                border: `1px solid ${p.accent}18`,
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px) scale(1.005)";
                el.style.boxShadow = "0 32px 72px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0) scale(1)";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, marginRight: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: p.accent, opacity: 0.55, letterSpacing: "0.1em" }}>{p.num}</span>
                    <span style={{ width: "1px", height: "12px", background: p.accent, opacity: 0.2 }} />
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: p.accent, opacity: 0.4 }}>{p.year}</span>
                  </div>
                  <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 38px)", color: p.accent, lineHeight: 1.1, marginBottom: "14px" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: p.accent, opacity: 0.65, lineHeight: 1.7, maxWidth: "520px" }}>
                    {p.desc}
                  </p>
                </div>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1.5px solid ${p.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.2s" }}>
                  <span style={{ fontSize: "16px", color: p.accent, opacity: 0.5 }}>↗</span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.06em", color: p.accent, opacity: 0.55, padding: "5px 12px", borderRadius: "4px", border: `1px solid ${p.accent}28` }}>
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

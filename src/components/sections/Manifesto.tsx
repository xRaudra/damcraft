"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const differentiators = [
  {
    num: "01",
    headline: "Structure over decoration.",
    body: "Most design chases what looks good today. We design what holds under the weight of real use — systems that work in ten years, not ten months.",
  },
  {
    num: "02",
    headline: "Depth over volume.",
    body: "We take fewer clients to give each project complete attention. Your work isn't one of fifty — it gets everything we have.",
  },
  {
    num: "03",
    headline: "One philosophy across four disciplines.",
    body: "UI/UX, Product, Brand, Interior — the same structural thinking applied to every surface. Rare coherence. Intentional by design.",
  },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Tag
      gsap.from(".mf-tag", {
        scrollTrigger: { trigger: ".mf-tag", start: "top 88%" },
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Headline chars slide up
      gsap.from(".mf-hchar", {
        scrollTrigger: { trigger: ".mf-headline-wrap", start: "top 85%" },
        y: "105%",
        opacity: 0,
        stagger: 0.018,
        duration: 0.7,
        ease: "power3.out",
      });

      // Divider lines draw in
      gsap.utils.toArray<HTMLElement>(".mf-divider").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.0,
          ease: "power2.inOut",
        });
      });

      // Each pillar slides up
      gsap.utils.toArray<HTMLElement>(".mf-pillar").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 84%" },
          y: 36,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        });
      });

      // Bottom CTA
      gsap.from(".mf-footer", {
        scrollTrigger: { trigger: ".mf-footer", start: "top 88%" },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const HEADLINE_1 = "Not another";
  const HEADLINE_2 = "design agency.";

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0602",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,83,0,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>

        {/* Eyebrow */}
        <div className="mf-tag" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px" }}>
          <span style={{ display: "block", width: "24px", height: "1px", background: "#FF5300", opacity: 0.5 }} />
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.18em", color: "rgba(255,83,0,0.6)", textTransform: "uppercase", margin: 0 }}>
            What Sets Us Apart
          </p>
        </div>

        {/* Split-char headline */}
        <div className="mf-headline-wrap" style={{ marginBottom: "80px" }}>
          <h2
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 5.5vw, 80px)",
              color: "#FAFAF8",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            <div style={{ overflow: "hidden", display: "block" }}>
              {HEADLINE_1.split("").map((char, i) => (
                <span key={`mh1-${i}`} className="mf-hchar" style={{ display: "inline-block" }}>
                  {char === " " ? " " : char}
                </span>
              ))}
            </div>
            <div style={{ overflow: "hidden", display: "block" }}>
              {HEADLINE_2.split("").map((char, i) => (
                <span key={`mh2-${i}`} className="mf-hchar" style={{ display: "inline-block", color: "#FF5300" }}>
                  {char === " " ? " " : char}
                </span>
              ))}
            </div>
          </h2>
        </div>

        {/* Pillars */}
        <div>
          {differentiators.map((d, i) => (
            <div key={d.num}>
              <div
                className="mf-divider"
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                  marginBottom: "48px",
                }}
              />
              <div className="mf-pillar mf-pillar-grid" style={{ paddingBottom: "48px" }}>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    color: "#FF5300",
                    opacity: 0.45,
                    paddingTop: "6px",
                    display: "block",
                  }}
                >
                  {d.num}
                </span>
                <h3
                  style={{
                    fontFamily: "Raleway, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(20px, 2.5vw, 34px)",
                    color: "#FAFAF8",
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  {d.headline}
                </h3>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "16px",
                    color: "#F3EBE1",
                    opacity: 0.48,
                    lineHeight: 1.9,
                    margin: 0,
                  }}
                >
                  {d.body}
                </p>
              </div>
            </div>
          ))}
          <div className="mf-divider" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Footer row */}
        <div
          className="mf-footer"
          style={{
            marginTop: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "15px",
              color: "#F3EBE1",
              opacity: 0.38,
              maxWidth: "420px",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Based in Noida. Working with clients who want design that outlasts the moment.
          </p>
          <a
            href="#contact"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "#FF5300",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid rgba(255,83,0,0.3)",
              paddingBottom: "4px",
              transition: "gap 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.gap = "16px";
              (e.currentTarget as HTMLElement).style.borderColor = "#FF5300";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.gap = "8px";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,83,0,0.3)";
            }}
          >
            Start a Project →
          </a>
        </div>
      </div>
    </section>
  );
}

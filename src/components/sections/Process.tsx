"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    num: "01",
    title: "Understand",
    body: "We start with your goals, constraints, and what you're actually solving for. No assumptions — just precise questions and sharper listening.",
  },
  {
    num: "02",
    title: "Design",
    body: "Concepts built on structural thinking, not aesthetic preference. We iterate fast, share early, and refine until every element earns its place.",
  },
  {
    num: "03",
    title: "Build",
    body: "Design executed to specification — pixel-perfect, performance-tested, and reviewed before anything goes live.",
  },
  {
    num: "04",
    title: "Endure",
    body: "You launch with a system built to hold. Handoff is complete, documented, and we stay close — because good work doesn't disappear after delivery.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".proc-header", {
        scrollTrigger: { trigger: ".proc-header", start: "top 85%" },
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
      });

      // Connecting line draws across on scroll
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1.5,
        },
        scaleX: 0,
        transformOrigin: "left center",
        ease: "none",
      });

      // Steps stagger in
      gsap.utils.toArray<HTMLElement>(".proc-step").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          opacity: 0,
          y: 36,
          duration: 0.65,
          delay: i * 0.12,
          ease: "power2.out",
        });
      });

      gsap.from(".proc-footer", {
        scrollTrigger: { trigger: ".proc-footer", start: "top 88%" },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" style={{ background: "#F3EBE1", padding: "100px 0" }}>
      <div className="wrap">
        <div className="proc-header" style={{ marginBottom: "64px" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase", marginBottom: "16px" }}>
            04 — Process
          </p>
          <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "#1A0E08", lineHeight: 1.1 }}>
            How We<br />Work
          </h2>
        </div>

        {/* Animated connecting line */}
        <div style={{ position: "relative", marginBottom: "0" }}>
          <div
            ref={lineRef}
            style={{
              position: "absolute",
              top: "28px",
              left: "28px",
              right: "28px",
              height: "1px",
              background: "linear-gradient(90deg, #FF5300, rgba(255,83,0,0.2))",
              zIndex: 0,
            }}
          />

          <div className="grid-4" style={{ position: "relative", zIndex: 1 }}>
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="proc-step"
                style={{
                  padding: "40px 32px",
                  borderLeft: i === 0 ? "none" : "1px solid rgba(74,53,48,0.1)",
                  position: "relative",
                }}
              >
                {/* Step number bubble */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#FF5300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "28px",
                    boxShadow: "0 0 0 6px rgba(255,83,0,0.12)",
                  }}
                >
                  <span style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "15px", color: "#FAFAF8" }}>
                    {s.num}
                  </span>
                </div>

                <h3 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "20px", color: "#1A0E08", marginBottom: "12px", letterSpacing: "0.01em" }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#4A3530", lineHeight: 1.8, opacity: 0.8 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="proc-footer" style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid rgba(74,53,48,0.12)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: "#4A3530", opacity: 0.7, maxWidth: "400px", lineHeight: 1.7 }}>
            We design with purpose — building systems that hold up under the weight of real use, not just ideal conditions.
          </p>
          <a
            href="mailto:hello@damcraft.com"
            style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.02em", background: "#1A0E08", color: "#FAFAF8", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", display: "inline-block", transition: "background 0.2s, transform 0.15s", flexShrink: 0 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FF5300"; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A0E08"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            Start Your Project →
          </a>
        </div>
      </div>
    </section>
  );
}

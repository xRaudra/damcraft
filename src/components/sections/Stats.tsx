"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: 40, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: "+", label: "Happy Clients" },
  { value: 3,  suffix: "+", label: "Years Active" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const els = document.querySelectorAll<HTMLElement>(".stat-num");
      els.forEach((el, i) => {
        const target = stats[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          val: target.value,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + target.suffix;
          },
        });

        gsap.from(el.parentElement, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#FAFAF8",
        borderTop: "1px solid rgba(74,53,48,0.08)",
        borderBottom: "1px solid rgba(74,53,48,0.08)",
      }}
    >
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
              <p
                className="stat-num"
                style={{
                  fontFamily: "Raleway, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(40px, 5vw, 60px)",
                  color: "#FF5300",
                  lineHeight: 1,
                  marginBottom: "10px",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}{s.suffix}
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "13px",
                  color: "#4A3530",
                  opacity: 0.6,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

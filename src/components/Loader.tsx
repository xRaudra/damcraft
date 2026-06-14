"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("dc-v2-loaded")) {
      setVisible(false);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("dc-v2-loaded", "1");
          setVisible(false);
        },
      });

      tl.from(logoRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.8)",
      })
        .from(labelRef.current, {
          opacity: 0,
          y: 8,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.3")
        .to(barRef.current, {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.inOut",
        }, "-=0.2")
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.55,
          ease: "power2.inOut",
          delay: 0.2,
        });
    });

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0A0602",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <svg
        ref={logoRef}
        width="72"
        height="64"
        viewBox="0 0 504 450"
        fill="none"
      >
        <path
          fill="#FF5300"
          d="M123.28,370.98l27.33,79.02h-54.66l27.33-79.02ZM269.39,450h22.87l-22.87-55.24v55.24ZM408.88,450v-55.24l-22.75,55.24h22.75ZM260.7,0h-17.4C108.93,0,0,108.93,0,243.3v206.7h54.55l45.24-126h47.27l45.24,126h36.49v-126h46.11l53.9,126h20.97l53.9-126h45.82v126h54.52v-206.7C504,108.93,395.07,0,260.7,0Z"
        />
      </svg>

      <p
        ref={labelRef}
        style={{
          fontFamily: "Raleway, sans-serif",
          fontWeight: 800,
          fontSize: "12px",
          letterSpacing: "0.35em",
          color: "rgba(250,250,248,0.6)",
          textTransform: "uppercase",
        }}
      >
        Damcraft
      </p>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,83,0,0.15)",
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            background: "#FF5300",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}

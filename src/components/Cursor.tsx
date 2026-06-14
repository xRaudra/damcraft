"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on pointer:fine devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: "none" });
    };

    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      gsap.set(ring, { x: rx, y: ry });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);

    // Hover expand/contract
    const onEnter = () => gsap.to(ring, { scale: 2.2, borderColor: "#FF5300", opacity: 0.5, duration: 0.3, ease: "power2.out" });
    const onLeave = () => gsap.to(ring, { scale: 1, borderColor: "rgba(255,255,255,0.35)", opacity: 1, duration: 0.3, ease: "power2.out" });

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    addListeners();

    // Re-scan after a tick so dynamically rendered elements get listeners
    const t = setTimeout(addListeners, 800);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      clearTimeout(t);
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#FF5300",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.35)",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />
    </>
  );
}

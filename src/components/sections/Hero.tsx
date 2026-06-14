"use client";
import { useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function LogoMark() {
  const groupRef = useRef<THREE.Group>(null);
  const data = useLoader(SVGLoader, "/logo.svg");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!groupRef.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      gsap.to(groupRef.current.rotation, {
        x: -y * 0.35,
        y: x * 0.55,
        duration: 1.1,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const geometry = useMemo(() => {
    const shapes: THREE.Shape[] = [];
    data.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((s) => shapes.push(s));
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 28,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 16,
    });
    geo.computeBoundingBox();
    if (geo.boundingBox) {
      const c = new THREE.Vector3();
      geo.boundingBox.getCenter(c);
      geo.translate(-c.x, -c.y, -c.z);
    }
    return geo;
  }, [data]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
  });

  return (
    <group ref={groupRef} scale={[0.01, -0.01, 0.01]}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          color="#FF5300"
          metalness={0.9}
          roughness={0.12}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          envMapIntensity={2}
          reflectivity={0.9}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 9, 4]} intensity={3.5} color="#FFFFFF" />
      <directionalLight position={[-4, 2, 3]} intensity={1.2} color="#FF8D60" />
      <pointLight position={[0, -6, 3]} intensity={2.5} color="#FF5300" />
      <pointLight position={[4, 5, -2]} intensity={1.8} color="#FFFFFF" />
      <Environment preset="studio" backgroundBlurriness={1} />
      <LogoMark />
    </>
  );
}

const LINE_1 = "Built to Last.";
const LINE_2 = "Crafted to Move.";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", { opacity: 0, duration: 0.6, delay: 0.1 });

      gsap.from(".hero-char", {
        y: "110%",
        opacity: 0,
        stagger: 0.022,
        duration: 0.75,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.from(".hero-sub", { opacity: 0, y: 22, duration: 0.7, ease: "power2.out", delay: 1.0 });
      gsap.from(".hero-cta-wrap", { opacity: 0, y: 18, duration: 0.6, ease: "power2.out", delay: 1.2 });
      gsap.from(".hero-scroll-ind", { opacity: 0, duration: 0.5, delay: 1.6 });
      gsap.from(".hero-stat", { opacity: 0, y: 10, stagger: 0.1, duration: 0.5, delay: 1.4 });

      // Parallax on scroll
      gsap.to(".hero-text-block", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: 90,
        opacity: 0,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "#000000", minHeight: "100vh", position: "relative", overflow: "hidden" }}
    >
      {/* Three.js canvas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 65% at 65% 45%, transparent 0%, rgba(0,0,0,0.5) 100%)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", background: "linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Text block */}
      <div className="hero-text-block" style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, paddingBottom: "88px" }}>
        <div className="wrap">
          <div className="hero-eyebrow" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ display: "block", width: "28px", height: "1px", background: "#FF5300", opacity: 0.55 }} />
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.18em", color: "rgba(255,83,0,0.75)", textTransform: "uppercase", margin: 0 }}>
              Design Studio · Noida · Est. 2024
            </p>
          </div>

          <h1 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(44px, 7vw, 100px)", color: "#FAFAF8", margin: "0 0 28px 0" }}>
            <div style={{ overflow: "hidden", display: "block", lineHeight: 1.05 }}>
              {LINE_1.split("").map((char, i) => (
                <span key={`l1-${i}`} className="hero-char" style={{ display: "inline-block", willChange: "transform" }}>
                  {char === " " ? " " : char}
                </span>
              ))}
            </div>
            <div style={{ overflow: "hidden", display: "block", lineHeight: 1.05 }}>
              {LINE_2.split("").map((char, i) => (
                <span key={`l2-${i}`} className="hero-char" style={{ display: "inline-block", color: "#FF5300", willChange: "transform" }}>
                  {char === " " ? " " : char}
                </span>
              ))}
            </div>
          </h1>

          <p className="hero-sub" style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", color: "#F3EBE1", opacity: 0.58, lineHeight: 1.85, maxWidth: "460px", marginBottom: "40px" }}>
            We design UI, brand identities, and spaces that hold up — because good work isn&apos;t finished until it can&apos;t be improved.
          </p>

          <div className="hero-cta-wrap" style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "center" }}>
            <a
              href="#work"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.02em", background: "#FF5300", color: "#FAFAF8", padding: "15px 34px", borderRadius: "8px", textDecoration: "none", display: "inline-block", transition: "background 0.2s, transform 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#E04900"; (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FF5300"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              See Our Work →
            </a>
            <a
              href="#process"
              style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "15px", color: "#F3EBE1", opacity: 0.7, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", transition: "opacity 0.2s, gap 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.gap = "14px"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; (e.currentTarget as HTMLElement).style.gap = "8px"; }}
            >
              How We Work <span style={{ color: "#FF5300" }}>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-ind" style={{ position: "absolute", bottom: "40px", right: "40px", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.14em", color: "#FF5300", opacity: 0.4, textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
        <div style={{ width: "1px", height: "52px", background: "linear-gradient(to bottom, #FF5300, transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
        <style>{`@keyframes scrollPulse { 0%,100%{opacity:0.4;transform:scaleY(1)} 50%{opacity:0.9;transform:scaleY(0.6)} }`}</style>
      </div>

      {/* Bottom stats strip */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, borderTop: "1px solid rgba(255,83,0,0.08)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: "13px 0" }}>
        <div className="wrap" style={{ display: "flex", gap: "40px", overflowX: "auto" }}>
          {[["40+", "Projects"], ["15+", "Clients"], ["4", "Disciplines"], ["100%", "Satisfaction"]].map(([val, label]) => (
            <div key={label} className="hero-stat" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "17px", color: "#FF5300" }}>{val}</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

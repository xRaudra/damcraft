"use client";
import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function LogoModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const { scene } = useGLTF("/models/logo.gltf");

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += (mouse.y * 0.15 - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z += (-mouse.x * 0.08 - groupRef.current.rotation.z) * 0.05;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
      <primitive
        ref={groupRef}
        object={scene.clone()}
        scale={0.018}
        castShadow
      />
    </Float>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FF8D60" size={0.045} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 6, 4]} intensity={3} color="#FF5300" />
      <pointLight position={[-4, -2, 2]} intensity={1.2} color="#FF8D60" />
      <Environment preset="city" />
      <LogoModel />
      <Particles />
    </>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (canvasRef.current) {
        canvasRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#1A0E08" }}>
      {/* Three.js canvas */}
      <div ref={canvasRef} className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(26,14,8,0.82) 0%, rgba(26,14,8,0.45) 50%, rgba(26,14,8,0.75) 100%)" }} />

      {/* Content */}
      <div className="wrap relative z-20 w-full" style={{ paddingTop: "128px", paddingBottom: "80px" }}>
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="mb-6" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", letterSpacing: "0.16em", color: "#FF5300", textTransform: "uppercase" }}>
            Design Studio · Noida · Est. 2024
          </p>

          {/* Headline */}
          <h1 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(48px, 7vw, 88px)", lineHeight: 1.05, color: "#FAFAF8", marginBottom: "24px" }}>
            Built to<br />
            <span style={{ color: "#FF5300" }}>Last.</span><br />
            Crafted to Move.
          </h1>

          {/* Sub */}
          <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 400, fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, color: "#F3EBE1", opacity: 0.75, maxWidth: "480px", marginBottom: "40px" }}>
            We design UI, brand identities, and spaces that hold up — because good work isn&apos;t finished until it can&apos;t be improved.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#work"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.02em", background: "#FF5300", color: "#FAFAF8", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", display: "inline-block", transition: "background 0.2s, transform 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#E04900"; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FF5300"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              See Our Work →
            </a>
            <a
              href="#process"
              style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "15px", color: "#F3EBE1", opacity: 0.8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
            >
              Our Process <span style={{ color: "#FF5300" }}>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.14em", color: "#FF5300", opacity: 0.6, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #FF5300, transparent)" }} />
      </div>
    </section>
  );
}

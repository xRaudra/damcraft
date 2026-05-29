"use client";
import { useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import gsap from "gsap";

function LogoMark() {
  const groupRef = useRef<THREE.Group>(null);
  const data = useLoader(SVGLoader, "/logo.svg");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!groupRef.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      gsap.to(groupRef.current.rotation, {
        x: -y * 0.4,  // mouse up → top tilts toward viewer
        y: x * 0.6,   // mouse right → right side comes forward
        duration: 1.0,
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
      depth: 24,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 14,
    });
    geo.computeBoundingBox();
    if (geo.boundingBox) {
      const c = new THREE.Vector3();
      geo.boundingBox.getCenter(c);
      geo.translate(-c.x, -c.y, -c.z);
    }
    return geo;
  }, [data]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef} scale={[0.01, -0.01, 0.01]}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          color="#FF5300"
          metalness={0.85}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          envMapIntensity={1.5}
          reflectivity={0.8}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 9, 4]} intensity={3} color="#FFFFFF" />
      <directionalLight position={[-3, 2, 3]} intensity={1} color="#FF8D60" />
      <pointLight position={[0, -6, 3]} intensity={2} color="#FF5300" />
      <pointLight position={[3, 4, -2]} intensity={1.5} color="#FFFFFF" />
      <Environment preset="studio" backgroundBlurriness={1} />
      <LogoMark />
    </>
  );
}

export default function Hero() {
  return (
    <section style={{ background: "#000000", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Full-screen 3D canvas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Bottom gradient for text readability */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Text — bottom left */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, paddingBottom: "80px" }}>
        <div className="wrap">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "rgba(255,83,0,0.75)", textTransform: "uppercase", marginBottom: "18px" }}>
            Design Studio · Noida · Est. 2024
          </p>
          <h1 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(40px, 5.5vw, 78px)", color: "#FAFAF8", lineHeight: 1.05, marginBottom: "20px", maxWidth: "660px" }}>
            Built to Last.<br />
            <span style={{ color: "#FF5300" }}>Crafted to Move.</span>
          </h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(15px, 1.8vw, 18px)", color: "#F3EBE1", opacity: 0.6, lineHeight: 1.75, maxWidth: "440px", marginBottom: "36px" }}>
            We design UI, brand identities, and spaces that hold up — because good work isn&apos;t finished until it can&apos;t be improved.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
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
              style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "15px", color: "#F3EBE1", opacity: 0.75, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            >
              Our Process <span style={{ color: "#FF5300" }}>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", letterSpacing: "0.14em", color: "#FF5300", opacity: 0.45, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, #FF5300, transparent)" }} />
      </div>
    </section>
  );
}

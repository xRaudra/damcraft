import type { Metadata } from "next";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";

export const metadata: Metadata = {
  title: "About — Damcraft",
  description: "Damcraft is a design studio in Noida built on the belief that good design is structural.",
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: "76px" }}>
      <About />
      <Stats />
    </main>
  );
}

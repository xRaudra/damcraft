import type { Metadata } from "next";
import Process from "@/components/sections/Process";

export const metadata: Metadata = {
  title: "Process — Damcraft",
  description: "How Damcraft works — understand, design, build, endure. A process built for lasting results.",
};

export default function ProcessPage() {
  return (
    <main style={{ paddingTop: "76px" }}>
      <Process />
    </main>
  );
}

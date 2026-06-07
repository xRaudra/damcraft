import type { Metadata } from "next";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Contact — Damcraft",
  description: "Start a project with Damcraft. No pitch, no fluff — just an honest conversation about what you need.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "76px" }}>
      <CTA />
    </main>
  );
}

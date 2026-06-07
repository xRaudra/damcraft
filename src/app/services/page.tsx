import type { Metadata } from "next";
import Services from "@/components/sections/Services";

export const metadata: Metadata = {
  title: "Services — Damcraft",
  description: "Brand identity, UI/UX design, product design, and interior design services by Damcraft.",
};

export default function ServicesPage() {
  return (
    <main style={{ paddingTop: "76px" }}>
      <Services />
    </main>
  );
}

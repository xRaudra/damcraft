import type { Metadata } from "next";
import Work from "@/components/sections/Work";

export const metadata: Metadata = {
  title: "Work — Damcraft",
  description: "Selected projects by Damcraft — brand identity, UI/UX, product design, and interior design.",
};

export default function WorkPage() {
  return (
    <main style={{ paddingTop: "76px" }}>
      <Work />
    </main>
  );
}

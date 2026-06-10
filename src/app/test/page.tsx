import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import CTA from "@/components/sections/CTA";

export default function TestHome() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Services />
      <Work />
      <CTA />
    </main>
  );
}

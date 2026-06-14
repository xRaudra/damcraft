import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Cursor />
      <Loader />
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />
      <Services />
      <Work />
      <Process />
      <About />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}

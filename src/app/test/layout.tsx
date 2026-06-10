import TestNav from "@/components/TestNav";
import Footer from "@/components/Footer";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TestNav />
      {children}
      <Footer />
    </>
  );
}

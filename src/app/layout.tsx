import type { Metadata } from "next";
import "./globals.css";
import SchemaMarkup from "./schema";

export const metadata: Metadata = {
  title: "Damcraft — Built to Last. Crafted to Move.",
  description: "Damcraft is a design studio in Noida, India. We work across brand identity, UI/UX, product design, and interior design — engineered for purpose, built to last.",
  keywords: ["brand identity design", "UI UX design", "product design", "interior design", "design studio", "Noida", "Damcraft"],
  authors: [{ name: "Saurabh Pandey", url: "https://damcraft.com" }],
  metadataBase: new URL("https://damcraft.com"),
  alternates: {
    canonical: "https://damcraft.com",
  },
  openGraph: {
    title: "Damcraft — Built to Last. Crafted to Move.",
    description: "Damcraft is a design studio in Noida, India. We work across brand identity, UI/UX, product design, and interior design — engineered for purpose, built to last.",
    url: "https://damcraft.com",
    siteName: "Damcraft",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Damcraft — Built to Last. Crafted to Move.",
    description: "Damcraft is a design studio in Noida, India. We work across brand identity, UI/UX, product design, and interior design.",
    creator: "@damcraft",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <SchemaMarkup />
        {children}
      </body>
    </html>
  );
}

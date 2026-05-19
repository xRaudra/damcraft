import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Damcraft — We Build Brands That Last",
  description: "Logo design, website design, and app design — crafted with precision for businesses that want to be remembered.",
  keywords: ["logo design", "website design", "app design", "branding", "design agency", "Noida"],
  authors: [{ name: "Saurabh Pandey", url: "https://damcraft.com" }],
  openGraph: {
    title: "Damcraft — We Build Brands That Last",
    description: "Logo design, website design, and app design — crafted with precision for businesses that want to be remembered.",
    url: "https://damcraft.com",
    siteName: "Damcraft",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

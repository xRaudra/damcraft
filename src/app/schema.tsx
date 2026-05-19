export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://damcraft.com/#organization",
        name: "Damcraft",
        url: "https://damcraft.com",
        logo: {
          "@type": "ImageObject",
          url: "https://damcraft.com/logo.png",
          width: 504,
          height: 450,
        },
        description:
          "Damcraft is a design studio based in Noida, India. We work across UI/UX, product design, brand identity, and interior design — built to last.",
        foundingDate: "2024",
        founders: [{ "@type": "Person", name: "Saurabh Pandey" }],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Noida",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@damcraft.com",
          contactType: "customer service",
        },
        sameAs: [],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://damcraft.com/#localbusiness",
        name: "Damcraft",
        url: "https://damcraft.com",
        email: "hello@damcraft.com",
        description:
          "Design studio in Noida specialising in brand identity, UI/UX design, product design, and interior design.",
        image: "https://damcraft.com/logo.png",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Noida",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 28.5355,
          longitude: 77.391,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Design Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Identity Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Design" } },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://damcraft.com/#website",
        url: "https://damcraft.com",
        name: "Damcraft",
        description: "Design studio built on the belief that good design is structural.",
        publisher: { "@id": "https://damcraft.com/#organization" },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

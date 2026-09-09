import { siteConfig } from "@/lib/site-config";

/** Organisation structured data for the Home page. Values are CLIENT TO CONFIRM. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: siteConfig.legalName,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    areaServed: ["US", "MX", "CA"],
    description:
      "Freight and commercial insurance brokerage. Coverage engineered around how your operation actually runs.",
    sameAs: siteConfig.socials
      .map((s) => s.href)
      .filter((href) => href.startsWith("http")),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

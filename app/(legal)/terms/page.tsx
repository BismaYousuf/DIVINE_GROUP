import type { Metadata } from "next";
import { LegalDoc } from "@/components/page/legal-doc";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Divine Group website.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ]}
      />
      <LegalDoc
        label="Legal"
        title="Terms of Use."
        intro="The terms that apply when you use this website."
        sections={[
          {
            heading: "Acceptance",
            body: "CLIENT TO CONFIRM — by using this site you agree to these terms; if you do not agree, do not use the site.",
          },
          {
            heading: "No offer of insurance",
            body: "CLIENT TO CONFIRM — nothing on this site binds coverage or constitutes an offer of insurance. Coverage exists only under a signed policy issued by a carrier.",
          },
          {
            heading: "Use of the site",
            body: "CLIENT TO CONFIRM — permitted use, prohibited conduct, and intellectual-property ownership of site content.",
          },
          {
            heading: "Liability",
            body: "CLIENT TO CONFIRM — the site is provided “as is”; limitation of liability and disclaimer of warranties, to the extent permitted by law.",
          },
          {
            heading: "Governing law",
            body: "CLIENT TO CONFIRM — the state whose law governs these terms and where disputes are resolved.",
          },
        ]}
      />
    </>
  );
}

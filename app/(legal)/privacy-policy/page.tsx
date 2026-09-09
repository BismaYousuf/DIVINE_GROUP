import type { Metadata } from "next";
import { LegalDoc } from "@/components/page/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Divine Group handles personal information submitted through this website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return (
    <LegalDoc
      label="Legal"
      title="Privacy Policy."
      intro="How we handle the information you send us through the quote and contact forms."
      sections={[
        {
          heading: "What we collect",
          body: "CLIENT TO CONFIRM — the fields submitted through the quote and contact forms (name, business, contact details, coverage details) and any documents you attach.",
        },
        {
          heading: "How we use it",
          body: "CLIENT TO CONFIRM — to prepare and service insurance quotes, to contact you about your request, and for the record-keeping a licensed brokerage is required to maintain.",
        },
        {
          heading: "Sharing",
          body: "CLIENT TO CONFIRM — with the carriers and underwriters needed to quote your risk, and with service providers acting on our behalf. We do not sell personal information.",
        },
        {
          heading: "Your choices",
          body: "CLIENT TO CONFIRM — how to request access, correction or deletion of your information, and how to opt out of marketing messages.",
        },
        {
          heading: "Contact",
          body: "CLIENT TO CONFIRM — the address and email for privacy requests.",
        },
      ]}
    />
  );
}

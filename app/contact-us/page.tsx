import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Divine Group team about coverage, claims or certificates.",
  alternates: { canonical: "/contact-us" },
};

export default function Page() {
  return (
    <PageStub
      label="Contact"
      title="Questions about coverage or a claim?"
      blurb="This page is being designed. Use the quote form on the Home page, or call the number in the footer and a specialist will help."
    />
  );
}

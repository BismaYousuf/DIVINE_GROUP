import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Divine Group website.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <PageStub
      label="Legal"
      title="Terms of Use."
      blurb="The full terms of use are being finalised with counsel. Nothing on this site is a binding offer of insurance; coverage is subject to a signed policy."
    />
  );
}

import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Coverage lines, specialty programs and risk management for freight and commercial operators.",
  alternates: { canonical: "/services" },
};

export default function Page() {
  return (
    <PageStub
      label="Services"
      title="Coverage, programs and risk management."
      blurb="This page is being designed. The Home page covers the lines we place most — start a quote and a specialist will map them to your operation."
    />
  );
}

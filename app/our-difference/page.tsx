import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Our Difference",
  description:
    "How Divine Group approaches freight and commercial insurance — built by people who run freight.",
  alternates: { canonical: "/our-difference" },
};

export default function Page() {
  return (
    <PageStub
      label="Our Difference"
      title="Built by people who run freight."
      blurb="This page is being designed. In the meantime, start a quote or reach us directly and we'll walk you through how we work."
    />
  );
}

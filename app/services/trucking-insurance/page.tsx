import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Trucking Insurance",
  description:
    "Auto liability, motor truck cargo, physical damage and specialty trucking programs from Divine Group.",
  alternates: { canonical: "/services/trucking-insurance" },
};

export default function Page() {
  return (
    <PageStub
      label="Services / Trucking Insurance"
      title="Coverage for owner-operators and fleets."
      blurb="This page is being designed. Start a quote and we'll build a program around your equipment, lanes and loss history."
    />
  );
}

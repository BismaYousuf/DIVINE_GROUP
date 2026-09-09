import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a freight or commercial insurance quote from Divine Group. A specialist reviews it and comes back with real numbers.",
  alternates: { canonical: "/get-a-quote" },
};

export default function Page() {
  return (
    <PageStub
      label="Get a Quote"
      title="The full quote form is on the way."
      blurb="For now, use the short quote form on the Home page — it reaches the same team. The detailed application (VINs, driver and equipment documents) is being built."
    />
  );
}

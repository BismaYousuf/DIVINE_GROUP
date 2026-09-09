import type { Metadata } from "next";
import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Divine Group handles personal information submitted through this site.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return (
    <PageStub
      label="Legal"
      title="Privacy Policy."
      blurb="The full privacy policy is being finalised with counsel. It will describe what we collect through the quote and contact forms, how it is used, and how to request removal."
    />
  );
}

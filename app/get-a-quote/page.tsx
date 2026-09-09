import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { QuoteForm } from "@/components/forms/quote-form";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a freight or commercial insurance quote from Divine Group. A specialist reviews your operation and comes back with real numbers.",
  alternates: { canonical: "/get-a-quote" },
};

export default function Page() {
  return (
    <>
      <PageHero
        label="Get a Quote"
        title="Tell us how your operation runs."
        intro="The more you can share up front — DOT number, vehicles, current documents — the faster we can put real numbers in front of you. Fields marked * are required; everything else helps."
      />

      <section
        aria-label="Quote request form"
        className="bg-paper pb-28 pt-4 md:pb-40"
      >
        <div className="mx-auto max-w-[46rem] gutter">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { SplitFeature } from "@/components/page/split-feature";
import { Reveal } from "@/components/motion/reveal";
import { truckingCoverageLinks, truckingPrograms } from "@/lib/site-config";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

const title = "Trucking Insurance";
const description =
  "Auto liability, motor truck cargo, physical damage and specialty trucking programs for owner-operators and fleets.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services/trucking-insurance" },
  openGraph: { title, description },
  twitter: { title, description },
};

// CLIENT TO CONFIRM — all copy on this page
const CATEGORIES = [
  {
    title: "Basic coverage",
    body: "Liability and collision working together — damage you cause to others, and damage to your own equipment.",
  },
  {
    title: "Specialized coverage",
    body: "For non-standard freight and operations: reefer breakdown, hazmat, oversize, high-value cargo.",
  },
  {
    title: "Premiums",
    body: "Priced on your safety record, radius, commodity and equipment — not a table rate. We show you the levers.",
  },
  {
    title: "Deductibles",
    body: "Structured to keep you covered without being cash-poor. Typical range runs a few hundred to a few thousand.",
  },
];

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Trucking Insurance", path: "/services/trucking-insurance" },
        ]}
      />
      <PageHero
        label="Services / Trucking Insurance"
        title="Coverage for owner-operators and fleets."
        intro="A true advisor to professionals in transportation — from a single truck to a thousand-unit operation, with specialty and cross-border programs for the loads and lanes standard markets won't touch."
      />

      {/* Lines of coverage */}
      <section aria-labelledby="lines-heading" className="bg-paper section-y">
        <div className="mx-auto max-w-content gutter">
          <h2 id="lines-heading" className="mono-label text-graphite">
            Lines of coverage
          </h2>
          <Reveal
            as="ul"
            stagger
            className="mt-10 grid gap-x-12 sm:grid-cols-2"
          >
            {truckingCoverageLinks.map((name, i) => (
              <li
                key={name}
                className="flex items-baseline gap-4 border-t border-hairline py-5"
              >
                <span className="mono-label text-graphite">
                  T-{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-heading font-medium">
                  {name}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Programs */}
      <section aria-labelledby="programs-heading" className="bg-paper pb-24 md:pb-32">
        <div className="mx-auto max-w-content gutter">
          <h2 id="programs-heading" className="mono-label text-graphite">
            Specialty programs
          </h2>
          <p className="mt-6 max-w-[56ch] text-body-l text-graphite">
            Niche and hard-to-place operations we write regularly:
          </p>
          <Reveal as="ul" className="mt-8 flex flex-wrap gap-2">
            {truckingPrograms.map((p) => (
              <li
                key={p}
                className="border border-hairline px-4 py-2 text-[0.875rem] text-ink"
              >
                {p}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Detail split features */}
      <section className="flex flex-col gap-20 bg-paper py-8 md:gap-28">
        <SplitFeature
          label="Total coverage"
          title="Protection that reaches past the collision."
          body="Fire and theft, physical damage repair, gap, towing, driver personal effects, medical payments, non-trucking liability, and pollution buyback — assembled so there isn't a seam where a claim falls through."
          img="/media/feature-01.jpg"
          imageSide="right"
        />
        <SplitFeature
          label="Cost-effective"
          title="Covered, without being insurance-rich and cash-poor."
          body="We tune limits and deductibles to your real exposure and cash position, and we tell you which factors are moving your premium so you can act on them before renewal."
          img="/media/feature-02.jpg"
          imageSide="left"
        />
      </section>

      {/* Category cards */}
      <section aria-labelledby="cat-heading" className="bg-paper pb-28 md:pb-40">
        <div className="mx-auto max-w-content gutter">
          <h2 id="cat-heading" className="mono-label text-graphite">
            How the coverage is built
          </h2>
          <Reveal
            as="ul"
            stagger
            className="mt-10 grid gap-x-16 gap-y-0 sm:grid-cols-2"
          >
            {CATEGORIES.map((c) => (
              <li
                key={c.title}
                className="border-t border-hairline py-8 md:py-10"
              >
                <h3 className="font-display text-heading font-medium">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-[44ch] text-body-l text-graphite">
                  {c.body}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand heading="Get your trucking quote." />
    </>
  );
}

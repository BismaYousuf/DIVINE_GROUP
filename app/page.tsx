import { Hero } from "@/components/home/hero";
import { PositioningStatement } from "@/components/home/positioning-statement";
import { Capabilities } from "@/components/home/capabilities";
import { CoverageBand } from "@/components/home/coverage-band";
import { InlineQuote } from "@/components/home/inline-quote";

export default function Home() {
  return (
    <>
      <Hero />
      <PositioningStatement />
      <Capabilities />
      <CoverageBand />
      <InlineQuote />

      {/* Remaining sections land in the following tasks. */}
      <section className="section-y gutter">
        <p className="max-w-[62ch] text-body-l text-graphite">
          Next: the Nocturne difference band, numbers, and the closing CTA.
        </p>
      </section>
    </>
  );
}

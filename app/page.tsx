import { Hero } from "@/components/home/hero";
import { PositioningStatement } from "@/components/home/positioning-statement";
import { Capabilities } from "@/components/home/capabilities";
import { CoverageBand } from "@/components/home/coverage-band";
import { InlineQuote } from "@/components/home/inline-quote";
import { DivineDifference } from "@/components/home/divine-difference";

export default function Home() {
  return (
    <>
      <Hero />
      <PositioningStatement />
      <Capabilities />
      <CoverageBand />
      <InlineQuote />
      <DivineDifference />

      {/* Numbers + closing CTA land in the next task. */}
      <section className="section-y gutter">
        <p className="max-w-[62ch] text-body-l text-graphite">
          Next: numbers, and the closing CTA.
        </p>
      </section>
    </>
  );
}

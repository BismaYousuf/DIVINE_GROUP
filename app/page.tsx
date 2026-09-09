import { Hero } from "@/components/home/hero";
import { PositioningStatement } from "@/components/home/positioning-statement";
import { Capabilities } from "@/components/home/capabilities";
import { CoverageBand } from "@/components/home/coverage-band";
import { InlineQuote } from "@/components/home/inline-quote";
import { DivineDifference } from "@/components/home/divine-difference";
import { Numbers } from "@/components/home/numbers";
import { CtaBand } from "@/components/home/cta-band";
import { JsonLd } from "@/components/seo/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <PositioningStatement />
      <Capabilities />
      <CoverageBand />
      <InlineQuote />
      <DivineDifference />
      <Numbers />
      <CtaBand />
    </>
  );
}

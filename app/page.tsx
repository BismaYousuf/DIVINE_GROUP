import { Hero } from "@/components/home/hero";
import { PositioningStatement } from "@/components/home/positioning-statement";

export default function Home() {
  return (
    <>
      <Hero />
      <PositioningStatement />

      {/* Remaining sections land in the following tasks. */}
      <section id="capabilities" className="section-y gutter">
        <p className="max-w-[62ch] text-body-l text-graphite">
          Next: capabilities sequence, coverage band, inline quote form, the
          Nocturne difference band, numbers, and the closing CTA.
        </p>
      </section>
    </>
  );
}

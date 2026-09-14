import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

// CLIENT TO CONFIRM — every figure below is a placeholder.
const STATS: { value: number; suffix?: string; label: string }[] = [
  {
    value: 14,
    label: "Lines of coverage we place for freight and commercial fleets",
  },
  { value: 24, suffix: "h", label: "Typical turnaround on a reviewed quote" },
  { value: 98, suffix: "%", label: "Certificate requests handled immediately" },
  {
    value: 3,
    label: "Countries covered — United States, Mexico and Canada",
  },
];

export function Numbers() {
  return (
    <section aria-labelledby="numbers-heading" className="bg-paper section-y">
      <div className="mx-auto max-w-content gutter">
        <h2 id="numbers-heading" className="mono-label text-graphite">
          05 — By the numbers
        </h2>

        <Reveal
          as="ul"
          stagger
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <li key={s.label} className="border-t border-hairline pt-6">
              <span className="block font-mono text-[clamp(2.5rem,5.2vw,4.25rem)] font-medium leading-none">
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
              <span className="mt-4 block max-w-[24ch] text-caption text-graphite">
                {s.label}
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

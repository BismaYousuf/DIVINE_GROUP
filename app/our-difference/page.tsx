import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

export const metadata: Metadata = {
  title: "Our Difference",
  description:
    "Divine Group is built by people who run freight. Mission, approach and the ways working with us pays off.",
  alternates: { canonical: "/our-difference" },
};

// CLIENT TO CONFIRM — all copy on this page
const BENEFITS = [
  {
    title: "Freight-side experience",
    body: "We have sat on your side of the desk — dispatch, safety, compliance. That is the lens we bring to every placement.",
  },
  {
    title: "Risk foresight",
    body: "We flag the exposures that move your premium before renewal, not after, and help you build the safety record that lowers it.",
  },
  {
    title: "Underwriter access",
    body: "Direct, long-standing relationships with the carriers that actually write transportation risk — so your submission gets a real look.",
  },
  {
    title: "Claims advocacy",
    body: "When a claim opens we stay in it: pushing adjusters, correcting the record, protecting your loss history.",
  },
  {
    title: "Certificates on demand",
    body: "COIs issued in minutes through a portal your brokers and shippers can self-serve — no waiting on an inbox.",
  },
];

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 40, suffix: "+", label: "Carrier relationships across transportation risk" },
  { value: 24, suffix: "h", label: "Typical turnaround on a reviewed quote" },
  { value: 3, label: "Countries covered — United States, Mexico and Canada" },
];

export default function Page() {
  return (
    <>
      <PageHero
        label="Our Difference"
        title="Built by people who run freight."
        intro="Divine Group started inside trucking and logistics operations, not an insurance office. We match the right strategy to how your business actually moves — and we stay in it after the policy binds."
      />

      {/* Mission & Vision */}
      <section
        aria-labelledby="mv-heading"
        className="bg-paper section-y"
      >
        <div className="mx-auto max-w-content gutter">
          <h2 id="mv-heading" className="mono-label text-graphite">
            Mission &amp; Vision
          </h2>
          <Reveal
            as="div"
            stagger
            className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20"
          >
            <p className="max-w-[42ch] font-display text-display-m font-medium leading-[1.1]">
              Superior risk management, delivered through people who pick up the
              phone.
            </p>
            <p className="max-w-[52ch] text-body-l text-graphite">
              We want to be the transportation insurance partner operators
              actually recommend — by applying technology where it removes
              friction, and staying human where judgement matters. Forward,
              transparent, and on your side.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How you benefit */}
      <section
        aria-labelledby="benefit-heading"
        className="bg-paper pb-24 md:pb-32"
      >
        <div className="mx-auto max-w-content gutter">
          <h2 id="benefit-heading" className="mono-label text-graphite">
            How you benefit
          </h2>
          <Reveal as="ul" stagger className="mt-10">
            {BENEFITS.map((b, i) => (
              <li
                key={b.title}
                className="grid gap-3 border-t border-hairline py-8 md:grid-cols-[0.4fr_1fr] md:gap-10 md:py-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="mono-label text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-heading font-medium">
                    {b.title}
                  </h3>
                </div>
                <p className="max-w-[56ch] text-body-l text-graphite">
                  {b.body}
                </p>
              </li>
            ))}
          </Reveal>

          <Reveal
            as="ul"
            stagger
            className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-hairline pt-10 sm:grid-cols-3"
          >
            {STATS.map((s) => (
              <li key={s.label}>
                <span className="block font-mono text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-none">
                  <CountUp value={s.value} suffix={s.suffix} />
                </span>
                <span className="mt-3 block max-w-[26ch] text-caption text-graphite">
                  {s.label}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="team-heading" className="bg-paper pb-28 md:pb-40">
        <div className="mx-auto max-w-content gutter">
          <h2 id="team-heading" className="mono-label text-graphite">
            The team
          </h2>
          <p className="mt-8 max-w-[56ch] font-display text-display-m font-medium leading-[1.1]">
            A small, senior team — most of it drawn straight from freight and
            logistics.
          </p>
          <p className="mt-6 max-w-[56ch] text-body-l text-graphite">
            Leadership bios and photos are coming. In the meantime, the person
            you speak with is the person who works your account.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

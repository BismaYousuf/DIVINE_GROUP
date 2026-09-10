import { SplitLines } from "@/components/motion/split-lines";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { siteConfig } from "@/lib/site-config";
import { HeroMedia } from "./hero-media";

export function Hero() {
  return (
    <section
      data-hero-dark
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper-hi"
    >
      <HeroMedia />

      <div className="relative z-10 mx-auto w-full max-w-content gutter pt-32 pb-[clamp(3.5rem,10vh,7rem)]">
        {/* CLIENT TO CONFIRM — hero copy */}
        <p className="mono-label text-paper-hi/55">
          Freight &amp; commercial insurance
        </p>

        <SplitLines
          as="h1"
          immediate
          className="mt-6 max-w-[16ch] font-semibold text-[clamp(2.75rem,7.6vw,6.75rem)] leading-[0.95] tracking-[-0.03em]"
        >
          Freight coverage,
          <br />
          engineered for
          <br />
          the long haul.
        </SplitLines>

        <p className="mt-8 max-w-[44ch] text-body-l text-accent">
          We build the policy around how your fleet actually runs — not the other
          way around.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href={siteConfig.cta.href}>Get a Quote</MagneticButton>
          <MagneticButton
            href="#capabilities"
            variant="ghost"
            className="border-paper-hi/30 text-paper-hi hover:border-paper-hi hover:bg-paper-hi/10"
          >
            See how we work
          </MagneticButton>
        </div>
      </div>

      {/* instrument readout — textural only */}
      <div
        aria-hidden
        className="relative z-10 mx-auto w-full max-w-content gutter pb-7"
      >
        <p className="mono-label tnum flex flex-wrap gap-x-6 gap-y-1 text-paper-hi/40">
          <span>Lines of coverage — 14</span>
          <span>Avg. response — 2h</span>
          <span>US / MX / CA</span>
        </p>
      </div>

      {/* scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex"
      >
        <span className="block h-12 w-px overflow-hidden bg-paper-hi/20">
          <span className="block h-3 w-px animate-[scroll-cue_1.9s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-accent" />
        </span>
      </div>
    </section>
  );
}

import { SplitLines } from "@/components/motion/split-lines";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Parallax } from "@/components/motion/parallax";
import { siteConfig } from "@/lib/site-config";

export function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-accent text-paper-hi section-y"
    >
      <Parallax speed={0.5} className="mx-auto max-w-content gutter">
        <SplitLines
          as="h2"
          id="cta-heading"
          className="max-w-[16ch] font-display text-display-l font-medium leading-[0.98]"
        >
          Let&rsquo;s build your coverage.
        </SplitLines>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <MagneticButton href={siteConfig.cta.href} variant="paper">
            Get a Quote
          </MagneticButton>
          <a
            href={siteConfig.phoneHref}
            className="mono-label text-paper-hi/80 transition-colors hover:text-paper-hi"
          >
            or talk to a specialist — {siteConfig.phone}
          </a>
        </div>
      </Parallax>
    </section>
  );
}

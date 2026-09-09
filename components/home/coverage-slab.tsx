import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SLAB =
  "group flex h-auto w-full shrink-0 flex-col justify-center border-t border-hairline px-6 py-9 transition-colors duration-300 motion-safe:lg:h-full motion-safe:lg:w-[clamp(15rem,29vw,25rem)] motion-safe:lg:border-l motion-safe:lg:border-t-0 motion-safe:lg:py-16";

type Base = { code: string; name: string; blurb: string };

export function CoverageSlab({ code, name, blurb }: Base) {
  return (
    <div className={`${SLAB} hover:bg-fog`}>
      <span className="mono-label text-graphite">{code}</span>
      <h3 className="relative mt-5 inline-block self-start font-display text-display-m font-medium leading-[1] transition-colors duration-300 group-hover:text-accent">
        {name}
        <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </h3>
      <p className="mt-4 max-w-[30ch] text-caption text-graphite transition-colors group-hover:text-ink">
        {blurb}
      </p>
    </div>
  );
}

export function CoverageCtaSlab({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className={`${SLAB} bg-accent text-paper-hi hover:bg-accent-press motion-safe:lg:w-[clamp(15rem,25vw,21rem)]`}
    >
      <span className="mono-label text-paper-hi/70">C — All</span>
      <h3 className="mt-5 font-display text-display-m font-medium leading-[1]">
        View all services
      </h3>
      <span className="mt-4 inline-flex items-center gap-2 text-caption">
        Coverage, programs &amp; risk management
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </span>
    </Link>
  );
}

export function CoverageIntroSlab() {
  return (
    <div className="flex h-auto w-full shrink-0 flex-col justify-center px-6 py-9 motion-safe:lg:h-full motion-safe:lg:w-[clamp(18rem,32vw,30rem)] motion-safe:lg:py-16">
      <span className="mono-label text-graphite">02 — Coverage</span>
      <h2
        id="coverage-heading"
        className="mt-5 max-w-[12ch] font-display text-display-l font-medium leading-[0.98]"
      >
        What we place.
      </h2>
      <p className="mt-5 max-w-[34ch] text-body text-graphite">
        The lines we write most for freight and commercial operators. Every
        program is assembled from these — not sold off a shelf.
      </p>
    </div>
  );
}

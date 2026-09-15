import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig, serviceCategories } from "@/lib/site-config";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

const title = "Services";
const description =
  "Coverage lines, specialty programs and risk management for freight and commercial operators.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description },
  twitter: { title, description },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <PageHero
        label="Services"
        title="Coverage, programs and risk management."
        intro="Every Divine Group program is assembled from these building blocks — matched to your equipment, your lanes and your loss history, not sold off a shelf."
      />

      {/* Categories */}
      <section aria-labelledby="cat-heading" className="bg-paper section-y">
        <div className="mx-auto max-w-content gutter">
          <h2 id="cat-heading" className="mono-label text-graphite">
            What we offer
          </h2>
          <Reveal as="ul" stagger className="mt-10">
            {serviceCategories.map((c, i) => (
              <li
                key={c.title}
                id={c.href.split("#")[1]}
                className="group border-t border-hairline last:border-b"
              >
                <Link
                  href={c.href}
                  className="grid gap-3 py-8 md:grid-cols-[0.5fr_1fr_auto] md:items-center md:gap-10 md:py-10"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="mono-label text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-heading font-medium transition-colors group-hover:text-accent">
                      {c.title}
                    </h3>
                  </div>
                  <p className="max-w-[56ch] text-body-l text-graphite">
                    {c.blurb}
                  </p>
                  <span
                    aria-hidden
                    className="hidden text-graphite transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent md:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Coverage lines */}
      <section
        aria-labelledby="lines-heading"
        className="bg-paper pb-28 md:pb-40"
      >
        <div className="mx-auto max-w-content gutter">
          <h2 id="lines-heading" className="mono-label text-graphite">
            Coverage lines we place
          </h2>
          <Reveal
            as="ul"
            stagger
            className="mt-10 grid gap-x-12 gap-y-0 sm:grid-cols-2"
          >
            {siteConfig.coverageLines.map((line) => (
              <li
                key={line.code}
                className="grid gap-1 border-t border-hairline py-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="mono-label text-graphite">{line.code}</span>
                  <h3 className="font-display text-heading font-medium">
                    {line.name}
                  </h3>
                </div>
                <p className="max-w-[40ch] text-caption text-graphite">
                  {line.blurb}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

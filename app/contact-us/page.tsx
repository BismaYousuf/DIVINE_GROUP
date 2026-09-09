import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Divine Group team about coverage, claims or certificates of insurance.",
  alternates: { canonical: "/contact-us" },
};

export default function Page() {
  const { address } = siteConfig;
  const mapsQuery = encodeURIComponent(
    [address.line1, address.city, address.state, address.zip]
      .filter((p) => p && p !== "—")
      .join(", ") || "Divine Group",
  );

  return (
    <>
      <PageHero
        label="Contact"
        title="Talk to a specialist."
        intro="Questions about coverage, a claim in motion, or a certificate you need in the next hour — reach us directly, or send a message and we'll come back to you the same day."
      />

      {/* Office */}
      <section aria-labelledby="office-heading" className="bg-paper section-y">
        <div className="mx-auto max-w-content gutter">
          <h2 id="office-heading" className="mono-label text-graphite">
            Office
          </h2>
          {/* CLIENT TO CONFIRM — real office address, phone, email */}
          <Reveal className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <address className="not-italic">
              <p className="font-display text-display-m font-medium leading-[1.1]">
                {address.line1}
              </p>
              <p className="mt-2 text-body-l text-graphite">
                {[address.line2, address.city, address.state, address.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="mono-label mt-6 flex flex-wrap gap-x-8 gap-y-2 text-ink">
                <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </p>
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 self-start text-[0.9375rem] text-ink md:self-end"
            >
              Get directions
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section
        aria-labelledby="message-heading"
        className="bg-paper pb-28 pt-4 md:pb-40"
      >
        <div className="mx-auto grid max-w-content gap-14 gutter lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2
              id="message-heading"
              className="font-display text-display-m font-medium leading-[1.05]"
            >
              Send us a message.
            </h2>
            <p className="mt-5 max-w-[32ch] text-body-l text-graphite">
              For a quote, the{" "}
              <a href="/get-a-quote" className="underline hover:text-ink">
                quote form
              </a>{" "}
              reaches the right desk faster.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

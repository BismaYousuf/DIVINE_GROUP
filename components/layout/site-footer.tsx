import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/motion/parallax";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-paper-hi">
      <div className="mx-auto max-w-content gutter pt-24 pb-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/media/logo-icon.png"
                alt=""
                width={195}
                height={169}
                className="h-8 w-auto object-contain"
              />
              <span className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.2em]">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-5 max-w-[32ch] text-caption text-paper-hi/60">
              {siteConfig.descriptor}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mono-label text-paper-hi/40">Site</p>
            <ul className="mt-5 flex flex-col gap-3 text-[0.9375rem]">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-paper-hi/80 transition-colors hover:text-paper-hi"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={siteConfig.cta.href}
                  className="text-paper-hi/80 transition-colors hover:text-paper-hi"
                >
                  {siteConfig.cta.label}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="mono-label text-paper-hi/40">Contact</p>
            <ul className="mt-5 flex flex-col gap-3 text-[0.9375rem] text-paper-hi/80">
              <li>
                <a href={siteConfig.phoneHref} className="hover:text-paper-hi">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-paper-hi"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-paper-hi/60">
              {siteConfig.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="hover:text-paper-hi"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.8125rem] text-paper-hi/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.legalName}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-paper-hi/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-paper-hi/80">
              Terms of Use
            </Link>
          </div>
        </div>

        <p className="mt-6 max-w-[70ch] text-[0.75rem] leading-relaxed text-paper-hi/35">
          {siteConfig.disclaimer}
        </p>
      </div>

      {/* Oversized wordmark, clipped by the footer's bottom edge. */}
      <Parallax
        speed={0.4}
        className="pointer-events-none absolute inset-x-0 -bottom-[0.16em] select-none gutter"
      >
        <span
          aria-hidden
          className="mx-auto block max-w-content whitespace-nowrap font-display font-semibold leading-none text-paper-hi/[0.055]"
          style={{ fontSize: "clamp(3rem, 13vw, 11rem)" }}
        >
          Divine Group
        </span>
      </Parallax>
    </footer>
  );
}

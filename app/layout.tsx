import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SkipLink } from "@/components/layout/skip-link";
import { GridLines } from "@/components/layout/grid-lines";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Divine Group — Freight & Commercial Insurance",
    template: "%s — Divine Group",
  },
  description:
    "Coverage engineered for freight and commercial operators. Divine Group builds insurance strategy around how your business actually runs.",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="relative min-h-dvh">
        <SkipLink />
        <GridLines />
        <SmoothScrollProvider>
          <SiteHeader />
          <main id="content" className="relative z-10">
            {children}
          </main>
          <SiteFooter />
        </SmoothScrollProvider>
        <Toaster />
      </body>
    </html>
  );
}

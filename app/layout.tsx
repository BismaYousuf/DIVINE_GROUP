import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Divine Group — Freight & Commercial Insurance",
    template: "%s — Divine Group",
  },
  description:
    "Coverage engineered for freight and commercial operators. Divine Group builds insurance strategy around how your business actually runs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

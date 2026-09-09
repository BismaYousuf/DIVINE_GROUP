import localFont from "next/font/local";
import { JetBrains_Mono, Instrument_Serif } from "next/font/google";

/**
 * Display — Clash Display (Fontshare, free for commercial use). Self-hosted.
 * Oversized editorial headlines and section titles.
 */
export const display = localFont({
  src: [
    { path: "../app/fonts/ClashDisplay-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/ClashDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * Body / UI — General Sans (Fontshare, free for commercial use). Self-hosted.
 * Deliberately not Inter.
 */
export const sans = localFont({
  src: [
    { path: "../app/fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-general",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

/** Data / kicker labels / numerals — JetBrains Mono (self-hosted by next/font at build). */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** Rare editorial accent — Instrument Serif italic. */
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

/** Combined class string for <html>. */
export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable} ${serif.variable}`;

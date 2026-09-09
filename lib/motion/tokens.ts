/**
 * Motion language — shared between every animated component.
 * Mirrors the CSS `--ease-*` tokens in app/globals.css.
 */

export const EASE = {
  /** standard entrance */
  out: "power3.out",
  /** heavier entrance, big type */
  outStrong: "power4.out",
  /** large positional moves */
  expo: "expo.out",
  /** pinned scrub segments */
  inOut: "power2.inOut",
  /** micro-interactions */
  micro: "power2.out",
} as const;

export const DUR = {
  micro: 0.3,
  enter: 0.8,
  cinematic: 1.3,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.08,
} as const;

/** Breakpoint (px) above which pins / horizontal scroll / heavy parallax run. */
export const DESKTOP_MIN = 1024;

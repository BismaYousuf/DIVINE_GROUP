/**
 * Hero scroll-driven frame sequence (Phase 3).
 *
 * Drop optimised WebP frames into `public/media/hero-frames/` named
 * `frame_0001.webp`, `frame_0002.webp`, … then set HERO_FRAME_COUNT to the
 * number of frames. While it is 0, the hero uses the static image exactly as
 * before — nothing else changes.
 *
 * See public/media/hero-frames/README.md for export guidance.
 */
export const HERO_FRAME_COUNT = 0;

/** How many viewport-heights of scroll the pinned sequence spans. */
export const HERO_FRAME_PIN_VH = 1.8;

export function heroFramePath(index: number): string {
  return `/media/hero-frames/frame_${String(index + 1).padStart(4, "0")}.webp`;
}

export const heroFramesEnabled = HERO_FRAME_COUNT >= 2;

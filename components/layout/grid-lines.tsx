/**
 * Faint column hairlines — a visible-grid motif. Decorative only.
 * Desktop (lg+) only; sits behind content.
 */
export function GridLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden justify-center lg:flex"
    >
      <div className="grid h-full w-full max-w-content grid-cols-12 gutter">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={i === 0 ? "" : "border-l border-hairline/60"} />
        ))}
      </div>
    </div>
  );
}

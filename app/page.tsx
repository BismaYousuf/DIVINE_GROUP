export default function Home() {
  return (
    <>
      {/* Temporary — replaced by the real Hero in the next task. */}
      <section className="flex min-h-dvh flex-col justify-end bg-ink gutter pb-24 text-paper-hi">
        <p className="mono-label text-paper-hi/50">Freight &amp; commercial insurance</p>
        <h1 className="mt-6 max-w-[14ch] text-display-xl">
          Coverage engineered for the road ahead.
        </h1>
      </section>

      <section className="section-y gutter">
        <p className="max-w-[62ch] text-body-l text-graphite">
          Foundation is up: tokens, fonts, motion primitives, header, footer.
          Sections land here next.
        </p>
      </section>

      <section
        data-invert-header
        className="section-y gutter bg-night text-night-fg"
      >
        <h2 className="text-display-m">A darker band to test header inversion.</h2>
      </section>

      <section className="section-y gutter">
        <p className="max-w-[62ch] text-body-l text-graphite">
          Back to paper. Scroll up to confirm the header reappears.
        </p>
      </section>
    </>
  );
}

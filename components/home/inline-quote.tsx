import { InlineQuoteForm } from "@/components/forms/inline-quote-form";

export function InlineQuote() {
  return (
    <section
      id="quote"
      aria-labelledby="quote-heading"
      className="bg-paper section-y"
    >
      <div className="mx-auto grid max-w-content gap-14 gutter lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mono-label text-graphite">03 — Quote</p>
          <h2
            id="quote-heading"
            className="mt-5 font-display text-display-l font-medium leading-[0.98]"
          >
            Start with a quote.
          </h2>
          {/* CLIENT TO CONFIRM — quote pitch copy */}
          <p className="mt-6 max-w-[34ch] text-body-l text-graphite">
            Tell us the shape of your operation. A specialist reviews it and comes
            back with real numbers — usually within a day.
          </p>
        </div>

        <InlineQuoteForm />
      </div>
    </section>
  );
}

import { PageHero } from "./page-hero";

export type LegalSection = { heading: string; body: string };

export function LegalDoc({
  label,
  title,
  intro,
  sections,
}: {
  label: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero label={label} title={title} intro={intro} />

      <section className="bg-paper pb-28 pt-4 md:pb-40">
        <article className="mx-auto max-w-[44rem] gutter">
          {sections.map((s) => (
            <div key={s.heading} className="border-t border-hairline py-10">
              <h2 className="font-display text-heading font-medium">
                {s.heading}
              </h2>
              <p className="mt-4 max-w-[68ch] text-pretty text-body text-graphite">
                {s.body}
              </p>
            </div>
          ))}
          <p className="mt-10 text-[0.8125rem] text-graphite/70">
            CLIENT TO CONFIRM — this document is a placeholder skeleton. Final
            wording to be supplied by counsel before launch.
          </p>
        </article>
      </section>
    </>
  );
}

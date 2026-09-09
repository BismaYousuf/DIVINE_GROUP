import { SplitLines } from "@/components/motion/split-lines";
import { cn } from "@/lib/utils";

export function PageHero({
  label,
  title,
  intro,
  tone = "paper",
}: {
  label: string;
  title: string;
  intro?: string;
  tone?: "paper" | "night";
}) {
  const night = tone === "night";
  return (
    <section
      className={cn(
        "relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44",
        night ? "bg-night text-night-fg" : "bg-paper text-ink",
      )}
    >
      <div className="mx-auto max-w-content gutter">
        <p
          className={cn(
            "mono-label",
            night ? "text-amber" : "text-graphite",
          )}
        >
          {label}
        </p>
        <SplitLines
          as="h1"
          immediate
          className="mt-6 max-w-[15ch] font-display text-display-l font-semibold leading-[0.98] tracking-[-0.025em]"
        >
          {title}
        </SplitLines>
        {intro ? (
          <p
            className={cn(
              "mt-8 max-w-[48ch] text-body-l",
              night ? "text-night-fg/75" : "text-graphite",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}

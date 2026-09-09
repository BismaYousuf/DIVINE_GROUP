import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageStub({
  label,
  title,
  blurb,
}: {
  label: string;
  title: string;
  blurb: string;
}) {
  return (
    <div className="flex min-h-[62svh] flex-col justify-center gutter section-y">
      <p className="mono-label text-graphite">{label}</p>
      <h1 className="mt-6 max-w-[18ch] font-display text-display-l font-medium leading-[0.98]">
        {title}
      </h1>
      <p className="mt-6 max-w-[52ch] text-body-l text-graphite">{blurb}</p>
      <p className="mt-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={1.5}
          />
          Back to home
        </Link>
      </p>
    </div>
  );
}

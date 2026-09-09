import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col justify-center gutter section-y">
      <p className="mono-label text-accent">Error 404</p>
      <h1 className="mt-6 max-w-[16ch] font-display text-display-l font-medium leading-[0.98]">
        This page took a wrong turn.
      </h1>
      <p className="mt-6 max-w-[46ch] text-body-l text-graphite">
        The address doesn&rsquo;t match anything we have. Let&rsquo;s get you back
        on route.
      </p>
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

import Image from "next/image";
import { cn } from "@/lib/utils";

export type Capability = {
  n: string;
  label: string;
  body: string;
  img: string;
};

export function CapabilityPanel({
  n,
  label,
  body,
  img,
  className,
}: Capability & { className?: string }) {
  return (
    <div
      className={cn(
        "grid items-center gap-x-10 gap-y-8 md:grid-cols-12",
        className,
      )}
    >
      <div className="relative md:col-span-6 md:col-start-1">
        <span
          aria-hidden
          className="block font-display text-[clamp(3.25rem,8vw,6.5rem)] font-semibold leading-[0.8] text-accent/15"
        >
          {n}
        </span>
        <p className="mono-label mt-3 text-graphite">{label}</p>
        {/* CLIENT TO CONFIRM — capability copy */}
        <p className="mt-4 max-w-[52ch] text-body-l text-ink">{body}</p>
      </div>

      <div className="md:col-span-5 md:col-start-8">
        <div className="cap-image relative aspect-[4/5] w-full max-w-[15rem] overflow-hidden md:max-w-[19rem]">
          <Image
            src={img}
            alt=""
            fill
            sizes="(min-width: 768px) 28vw, 80vw"
            className="object-cover [filter:grayscale(1)_contrast(1.05)]"
          />
        </div>
      </div>
    </div>
  );
}

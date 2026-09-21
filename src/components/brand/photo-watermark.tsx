import { Wordmark } from "@/components/brand/logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type PhotoWatermarkSize = "default" | "compact" | "micro";

export function PhotoWatermark({
  size = "default",
}: {
  size?: PhotoWatermarkSize;
}) {
  const micro = size === "micro";
  const compact = size === "compact";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 flex items-center rounded-full bg-[#0A0A0B]/65 text-[#F4F4F5] shadow-[0_1px_8px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-[6px]",
        micro
          ? "right-1 bottom-1 gap-1 px-1.5 py-px"
          : compact
            ? "right-1.5 bottom-1.5 gap-1.5 px-2 py-[3px]"
            : "right-2.5 bottom-2.5 gap-2 px-2.5 py-1 sm:right-3 sm:bottom-3",
      )}
    >
      <Wordmark
        className={cn(
          "w-auto fill-current text-[#F4F4F5]",
          micro ? "h-2.5" : compact ? "h-3.5" : "h-4 sm:h-[1.15rem]",
        )}
      />
      <span
        className={cn(
          "font-medium tracking-wide whitespace-nowrap",
          micro
            ? "text-[0.45rem] leading-none"
            : compact
              ? "text-[0.58rem] leading-none"
              : "text-[0.68rem] leading-none sm:text-xs",
        )}
      >
        {site.social.instagramHandle}
      </span>
    </div>
  );
}

export function WatermarkedPhoto({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: PhotoWatermarkSize;
}) {
  return (
    <div
      className={cn(
        "cover-frame relative min-w-0 max-w-full overflow-hidden rounded-md bg-surface",
        className,
      )}
    >
      {children}
      <PhotoWatermark size={size} />
    </div>
  );
}

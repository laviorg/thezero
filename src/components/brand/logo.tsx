import {
  MARK_PATH,
  MARK_VIEWBOX,
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type BrandSvgProps = ComponentPropsWithoutRef<"svg"> & {
  title?: string;
};

export function Wordmark({
  className,
  title = "The Zero",
  ...props
}: BrandSvgProps) {
  const hidden = props["aria-hidden"] === true;

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      role={hidden ? undefined : "img"}
      aria-label={hidden ? undefined : title}
      className={cn("h-9 w-auto fill-current", className)}
      {...props}
    >
      {hidden ? null : <title>{title}</title>}
      {WORDMARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function SplitOMark({
  className,
  title = "The Zero",
  ...props
}: BrandSvgProps) {
  const hidden = props["aria-hidden"] === true;

  return (
    <svg
      viewBox={MARK_VIEWBOX}
      role={hidden ? undefined : "img"}
      aria-label={hidden ? undefined : title}
      className={cn("size-8 fill-current", className)}
      {...props}
    >
      {hidden ? null : <title>{title}</title>}
      <path d={MARK_PATH} />
    </svg>
  );
}

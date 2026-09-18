import {
  MARK_PATH,
  MARK_VIEWBOX,
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";
import { cn } from "@/lib/utils";

type BrandSvgProps = {
  className?: string;
  title?: string;
};

export function Wordmark({
  className,
  title = "The Zero",
}: BrandSvgProps) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label={title}
      className={cn("h-9 w-auto fill-current", className)}
    >
      <title>{title}</title>
      {WORDMARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function SplitOMark({
  className,
  title = "The Zero",
}: BrandSvgProps) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      role="img"
      aria-label={title}
      className={cn("size-8 fill-current", className)}
    >
      <title>{title}</title>
      <path d={MARK_PATH} />
    </svg>
  );
}

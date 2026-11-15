import {
  BRAND_ACCENT,
  MARK_ACCENT_PATHS,
  MARK_PATHS,
  MARK_VIEWBOX,
  WORDMARK_VIEWBOX,
  wordmarkElements,
} from "@/components/brand/wordmark-paths";
import { createElement } from "react";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BrandSvgProps = ComponentPropsWithoutRef<"svg"> & {
  title?: string;
  /** Pinta o ponto/underscore azul com currentColor (marcas d'água monocromáticas). */
  mono?: boolean;
};

export function Wordmark({
  className,
  title = "The Zero",
  mono = false,
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
      {wordmarkElements(createElement as never, { mono }) as ReactNode[]}
    </svg>
  );
}

/** Símbolo (zero cápsula com corte + ponto). Nome mantido por compatibilidade. */
export function SplitOMark({
  className,
  title = "The Zero",
  mono = false,
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
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
      {MARK_ACCENT_PATHS.map((d) => (
        <path key={d} d={d} fill={mono ? "currentColor" : BRAND_ACCENT} />
      ))}
    </svg>
  );
}

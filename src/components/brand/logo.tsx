import {
  BRAND_ACCENT,
  BRAND_ICON_BG,
  BRAND_ICON_FG,
  WORDMARK_SYMBOL_TRANSFORM,
  LOCKUP_BG_PATH,
  MARK_ACCENT_PATHS,
  MARK_PATHS,
  MARK_VIEWBOX,
  WORDMARK_ACCENT_PATHS,
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

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
      <g transform={WORDMARK_SYMBOL_TRANSFORM}>
        <path d={LOCKUP_BG_PATH} fill={BRAND_ICON_BG} />
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} fill={BRAND_ICON_FG} />
        ))}
        {MARK_ACCENT_PATHS.map((d) => (
          <path key={d} d={d} fill={BRAND_ACCENT} />
        ))}
        {/* Borda sutil só no escuro (fundo do símbolo ≈ fundo do site). 1px, interna. */}
        <rect
          x={-1.5}
          y={-4}
          width={72}
          height={72}
          rx={14.6}
          fill="none"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="stroke-transparent dark:stroke-white/15"
        />
      </g>
      {WORDMARK_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
      {WORDMARK_ACCENT_PATHS.map((d) => (
        <path key={d} d={d} fill={mono ? "currentColor" : BRAND_ACCENT} />
      ))}
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

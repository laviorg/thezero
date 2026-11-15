import {
  BRAND_ACCENT,
  BRAND_ICON_BG,
  BRAND_ICON_FG,
  ICON_BG_PATH,
  ICON_VIEWBOX,
  MARK_ACCENT_PATHS,
  MARK_PATHS,
  WORDMARK_VIEWBOX,
  wordmarkElements,
} from "@/components/brand/wordmark-paths";
import { createElement, type ReactNode } from "react";
import { ogPalette } from "@/lib/theme";

const [, , viewW, viewH] = WORDMARK_VIEWBOX.split(" ").map(Number);

export function ogWordmarkSize(width: number) {
  return { width, height: Math.round((width * viewH) / viewW) };
}

export function OgWordmark({
  width,
  color = ogPalette.fg,
}: {
  width: number;
  color?: string;
}) {
  const { height } = ogWordmarkSize(width);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={WORDMARK_VIEWBOX}
    >
      {wordmarkElements(createElement as never, { color }) as ReactNode[]}
    </svg>
  );
}

/** Ícone completo (fundo #09090B, zero branco, ponto azul) — simbolo.svg. */
export function OgSplitO({
  size,
  background = true,
}: {
  size: number;
  background?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={ICON_VIEWBOX}
    >
      {background ? <path d={ICON_BG_PATH} fill={BRAND_ICON_BG} /> : null}
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} fill={BRAND_ICON_FG} />
      ))}
      {MARK_ACCENT_PATHS.map((d) => (
        <path key={d} d={d} fill={BRAND_ACCENT} />
      ))}
    </svg>
  );
}

/** Corner badge for generated OG / social images (wordmark + Instagram). */
export function OgWatermarkBadge({
  handle = "@hello.the.zero",
}: {
  handle?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        position: "absolute",
        right: 28,
        bottom: 28,
        background: "rgba(12, 18, 32, 0.68)",
        borderRadius: 999,
        padding: "8px 16px 8px 14px",
        border: "1px solid rgba(255, 255, 255, 0.14)",
      }}
    >
      <OgWordmark width={86} />
      <div
        style={{
          display: "flex",
          color: ogPalette.fg,
          fontSize: 18,
          letterSpacing: "0.02em",
          fontWeight: 500,
        }}
      >
        {handle}
      </div>
    </div>
  );
}

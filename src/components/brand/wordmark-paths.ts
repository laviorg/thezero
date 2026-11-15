// Logo The Zero (2026-10). Wordmark aprovado = THE_ZERO-logo-adaptavel.svg (final/, JetBrains Mono 800, zero com ponto azul),
// texto convertido em path (não depende de fonte).
// Gerado a partir de escrita.svg / simbolo.svg. Paths "main" usam currentColor.

export const BRAND_ACCENT = "#2563EB";
export const BRAND_ICON_BG = "#09090B";
export const BRAND_ICON_FG = "#FAFAFA";

/** Símbolo sem fundo (para uso com currentColor). */
export const MARK_VIEWBOX = "17.825 11.875 39.4 40.25";

export const MARK_PATHS = [
  "M32 12.875H32A13.175 13.175 0 0 1 45.175 26.05V37.95A13.175 13.175 0 0 1 32 51.125H32A13.175 13.175 0 0 1 18.825 37.95V26.05A13.175 13.175 0 0 1 32 12.875ZM32 19.471A6.579 6.579 0 0 0 25.421 26.05V37.95A6.579 6.579 0 0 0 32 44.529H32A6.579 6.579 0 0 0 38.579 37.95V26.05A6.579 6.579 0 0 0 32 19.471Z",
  "M27.599 43.095L41.199 24.395L36.401 20.905L22.801 39.605Z",
] as const;

export const MARK_ACCENT_PATHS = [
  "M47.725 46.875A4.25 4.25 0 1 0 56.225 46.875A4.25 4.25 0 1 0 47.725 46.875Z",
] as const;

/** Símbolo completo (ícone 64x64 com fundo). */
export const ICON_VIEWBOX = "0 0 64 64";

export const ICON_BG_PATH = "M14 0H50A14 14 0 0 1 64 14V50A14 14 0 0 1 50 64H14A14 14 0 0 1 0 50V14A14 14 0 0 1 14 0Z";

/** Logo aprovado (THE_ZERO-logo-adaptavel.svg, sem redesenho). currentColor = cor do texto; #2563EB = acento. */
export const WORDMARK_VIEWBOX = "0 0 200.82 39.20";

export type LogoNode = {
  tag: string;
  attrs: Record<string, string>;
  children?: LogoNode[];
};

export const WORDMARK_NODES: LogoNode[] = [
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(0.00,33.20) scale(0.04000,-0.04000)",
      "d": "M225 0V590H40V730H560V590H375V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(24.00,33.20) scale(0.04000,-0.04000)",
      "d": "M66 0V730H216V450H384V730H534V0H384V310H216V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(48.00,33.20) scale(0.04000,-0.04000)",
      "d": "M80 0V730H530V602H227V438H495V310H227V128H530V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(72.00,26.60) scale(0.04000,-0.04000)",
      "d": "M60 -165V-25H540V-165Z",
      "fill": "#2563EB"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(96.00,33.20) scale(0.04000,-0.04000)",
      "d": "M75 0V140L343 590H83V730H514V590L245 140H525V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(120.00,33.20) scale(0.04000,-0.04000)",
      "d": "M80 0V730H530V602H227V438H495V310H227V128H530V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(144.00,33.20) scale(0.04000,-0.04000)",
      "d": "M65 0V730H300Q378 730 435.0 703.0Q492 676 523.5 626.0Q555 576 555 508Q555 437 520.5 381.0Q486 325 427 300L565 0H402L284 276H214V0ZM214 406H300Q350 406 377.5 431.0Q405 456 405 501Q405 548 377.5 574.0Q350 600 300 600H214Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "g",
    "attrs": {
      "transform": "translate(159.884,-2.164) scale(0.64889)"
    },
    "children": [
      {
        "tag": "rect",
        "attrs": {
          "x": "19.38",
          "y": "13.38",
          "width": "23.24",
          "height": "37.24",
          "rx": "11.62",
          "stroke": "currentColor",
          "strokeWidth": "7.76",
          "fill": "none"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "23",
          "y1": "43",
          "x2": "39",
          "y2": "21",
          "stroke": "currentColor",
          "strokeWidth": "6.98"
        }
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": "54.50",
          "cy": "49.5",
          "r": "5",
          "fill": "#2563EB"
        }
      }
    ]
  }
];

type CreateEl = (tag: string, props: Record<string, unknown>, ...children: unknown[]) => unknown;

/**
 * Converte WORDMARK_NODES em elementos (React.createElement). `color` substitui
 * currentColor (ex.: OG/Satori); `mono` pinta o azul com a mesma cor.
 */
export function wordmarkElements(
  h: CreateEl,
  { color = "currentColor", mono = false }: { color?: string; mono?: boolean } = {},
): unknown[] {
  const fix = (v: string) =>
    v === "currentColor" ? color : mono && v === BRAND_ACCENT ? color : v;
  const build = (n: LogoNode, i: number): unknown => {
    const props: Record<string, unknown> = { key: i };
    for (const [k, v] of Object.entries(n.attrs)) {
      props[k] = k === "fill" || k === "stroke" ? fix(v) : v;
    }
    return h(n.tag, props, ...(n.children ?? []).map(build));
  };
  return WORDMARK_NODES.map(build);
}

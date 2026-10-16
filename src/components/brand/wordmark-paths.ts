// Logo The Zero (2026-10). Wordmark aprovado = THE_ZERO-logo-adaptavel.svg (THE_ZER + zero cápsula),
// texto em Geist Mono convertido em path (não depende de fonte).
// Gerado a partir de escrita.svg / simbolo.svg. Paths "main" usam currentColor.

export const BRAND_ACCENT = "#2563EB";
export const BRAND_ICON_BG = "#09090B";
export const BRAND_ICON_FG = "#FAFAFA";

/** Símbolo sem fundo (para uso com currentColor). */
export const MARK_VIEWBOX = "14 8 42 48";

export const MARK_PATHS = [
  "M31.0 9.5H31.0A15.5 15.5 0 0 1 46.5 25.0V39.0A15.5 15.5 0 0 1 31.0 54.5H31.0A15.5 15.5 0 0 1 15.5 39.0V25.0A15.5 15.5 0 0 1 31.0 9.5ZM31.0 14.5A10.5 10.5 0 0 0 20.5 25.0V39.0A10.5 10.5 0 0 0 31.0 49.5H31.0A10.5 10.5 0 0 0 41.5 39.0V25.0A10.5 10.5 0 0 0 31.0 14.5Z",
  "M22.45 47.15L43.15 19.55L39.55 16.85L18.85 44.45Z",
] as const;

export const MARK_ACCENT_PATHS = [
  "M44.5 14A4.5 4.5 0 1 0 53.5 14A4.5 4.5 0 1 0 44.5 14Z",
] as const;

/** Símbolo completo (ícone 64x64 com fundo). */
export const ICON_VIEWBOX = "0 0 64 64";

export const ICON_BG_PATH = "M14 0H50A14 14 0 0 1 64 14V50A14 14 0 0 1 50 64H14A14 14 0 0 1 0 50V14A14 14 0 0 1 14 0Z";

/** Logo aprovado (THE_ZERO-logo-adaptavel.svg, sem redesenho). currentColor = cor do texto; #2563EB = acento. */
export const WORDMARK_VIEWBOX = "0 0 196.84 36.40";

export type LogoNode = {
  tag: string;
  attrs: Record<string, string>;
  children?: LogoNode[];
};

export const WORDMARK_NODES: LogoNode[] = [
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(0.00,32.40) scale(0.04000,-0.04000)",
      "d": "M228.8011474609375 0V581.601806640625H40V710H560V581.601806640625H371.1988525390625V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(24.00,32.40) scale(0.04000,-0.04000)",
      "d": "M48.00048828125 0V710H190.398193359375V373.399658203125L137.3985595703125 421.1990966796875H462.6014404296875L409.601806640625 373.399658203125V710H551.99951171875V0H409.601806640625V340.600341796875L462.6014404296875 292.8009033203125H137.3985595703125L190.398193359375 340.600341796875V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(48.00,32.40) scale(0.04000,-0.04000)",
      "d": "M84.000244140625 0V710H527.999755859375V581.601806640625H226.39794921875V418.59912109375H515.999755859375V293.40087890625H226.39794921875V128.398193359375H535.999755859375V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(72.00,27.55) scale(0.04000,-0.04000)",
      "d": "M68.00048828125 -121.1982421875V0H531.99951171875V-121.1982421875Z",
      "fill": "#2563EB"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(96.00,32.40) scale(0.04000,-0.04000)",
      "d": "M44.000244140625 0V127.998291015625L381.20263671875 581.601806640625H62.000244140625V710H547.999755859375V582.001708984375L214.397216796875 128.398193359375H555.999755859375V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(120.00,32.40) scale(0.04000,-0.04000)",
      "d": "M84.000244140625 0V710H527.999755859375V581.601806640625H226.39794921875V418.59912109375H515.999755859375V293.40087890625H226.39794921875V128.398193359375H535.999755859375V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(144.00,32.40) scale(0.04000,-0.04000)",
      "d": "M61.600341796875 0V710H290.7998046875Q405.7996826171875 710 470.49969482421875 652.6000366210938Q535.19970703125 595.2000732421875 535.19970703125 496.800048828125Q535.19970703125 444.400146484375 513.0996704101562 405.3001708984375Q490.9996337890625 366.2001953125 453.19970703125 343.90020751953125Q415.3997802734375 321.6002197265625 369.60009765625 318.000244140625L365.60009765625 331.2001953125Q444.999755859375 329.60009765625 484.099609375 298.400146484375Q523.199462890625 267.2001953125 529.199462890625 198.000244140625L545.99951171875 0H402.40185546875L389.6016845703125 160.0013427734375Q386.6016845703125 200.2010498046875 375.60162353515625 221.301025390625Q364.6015625 242.4010009765625 342.00140380859375 250.10107421875Q319.4012451171875 257.8011474609375 281.200927734375 257.8011474609375H203.998046875V0ZM203.998046875 386.1993408203125H286Q336.0009765625 386.1993408203125 362.4014892578125 411.899658203125Q388.802001953125 437.5999755859375 388.802001953125 484.2005615234375Q388.802001953125 531.201171875 362.4014892578125 556.4014892578125Q336.0009765625 581.601806640625 286 581.601806640625H203.998046875Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "g",
    "attrs": {
      "transform": "translate(159.554,-2.906) scale(0.65956)"
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
          "strokeWidth": "7",
          "strokeLinecap": "square"
        }
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": "49",
          "cy": "14",
          "r": "4.5",
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

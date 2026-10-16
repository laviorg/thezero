// Logo The Zero (2026-10). Wordmark aprovado = logo-proposta.svg (THE_ZER + zero cápsula),
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

/** Logo aprovado (logo-proposta.svg, sem redesenho). currentColor = cor do texto; #2563EB = acento. */
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
      "d": "M256.05908203125 0V624.5185546875H40V710H560V624.5185546875H343.94091796875V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(24.00,32.40) scale(0.04000,-0.04000)",
      "d": "M59.599609375 0V710H147.4814453125V365.2802734375L103.18115234375 399.74072265625H496.81884765625L452.5185546875 365.2802734375V710H540.400390625V0H452.5185546875V348.7197265625L496.81884765625 314.25927734375H103.18115234375L147.4814453125 348.7197265625V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(48.00,32.40) scale(0.04000,-0.04000)",
      "d": "M89.7998046875 0V710H522.2001953125V624.5185546875H177.681640625V397.720703125H510.2001953125V314.279296875H177.681640625V85.4814453125H530.2001953125V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(72.00,32.40) scale(0.04000,-0.04000)",
      "d": "M79.599609375 -79.44140625V0H520.400390625V-79.44140625Z",
      "fill": "#2563EB"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(96.00,32.40) scale(0.04000,-0.04000)",
      "d": "M49.7998046875 0V87.4013671875L443.837890625 624.5185546875H67.7998046875V710H542.2001953125V622.5986328125L148.2822265625 85.4814453125H550.2001953125V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(120.00,32.40) scale(0.04000,-0.04000)",
      "d": "M89.7998046875 0V710H522.2001953125V624.5185546875H177.681640625V397.720703125H510.2001953125V314.279296875H177.681640625V85.4814453125H530.2001953125V0Z",
      "fill": "currentColor"
    }
  },
  {
    "tag": "path",
    "attrs": {
      "transform": "translate(144.00,32.40) scale(0.04000,-0.04000)",
      "d": "M69.7197265625 0V710H286.16015625Q398.26025390625 710 463.250244140625 653.469970703125Q528.240234375 596.93994140625 528.240234375 497.9599609375Q528.240234375 447.8798828125 505.270263671875 409.35986328125Q482.30029296875 370.83984375 446.240234375 348.829833984375Q410.18017578125 326.81982421875 371.919921875 323.7998046875L367.919921875 335.83984375Q439.2001953125 331.919921875 474.8203125 301.8798828125Q510.4404296875 271.83984375 516.4404296875 203.7998046875L534.400390625 0H446.478515625L429.61865234375 191.89892578125Q426.61865234375 225.13916015625 414.168701171875 245.6591796875Q401.71875 266.17919921875 375.348876953125 275.619140625Q348.97900390625 285.05908203125 303.2392578125 285.05908203125H157.6015625V0ZM157.6015625 370.54052734375H286Q359.19921875 370.54052734375 397.77880859375 403.7802734375Q436.3583984375 437.02001953125 436.3583984375 497.53955078125Q436.3583984375 559.0390625 397.77880859375 591.77880859375Q359.19921875 624.5185546875 286 624.5185546875H157.6015625Z",
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
          "x": "18",
          "y": "12",
          "width": "26",
          "height": "40",
          "rx": "13",
          "stroke": "currentColor",
          "strokeWidth": "5",
          "fill": "none"
        }
      },
      {
        "tag": "line",
        "attrs": {
          "x1": "22",
          "y1": "44",
          "x2": "40",
          "y2": "20",
          "stroke": "currentColor",
          "strokeWidth": "4.5",
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

/**
 * Branded editorial covers for evergreen posts that do not already have a
 * photo: review, guia, comparativo, vale-a-pena and tutorial.
 *
 * Reuses the article OG palette (`ogPalette` in src/lib/theme.ts): navy field,
 * category accent, Geist, and the split-O wordmark. Renders with `next/og`
 * (same engine as `opengraph-image.tsx`) and writes WebP via sharp.
 * Review-archive posters stay in `public/covers/reviews/`. Tutorials go to
 * `public/covers/tutoriais/`. A vale-a-pena without a press photo goes to
 * `public/covers/vale-a-pena/`. Anything already under `/images/` is left
 * alone.
 *
 *   npm run covers
 *   npm run covers -- --slug rtx-4060-vs-5060-brasil
 *   npm run covers -- --force
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import type { ReactElement } from "react";
import matter from "gray-matter";
import sharp from "sharp";
import {
  MARK_PATH,
  MARK_VIEWBOX,
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from "../src/components/brand/wordmark-paths.ts";
import { getCategory, getSubcategory } from "../src/lib/categories.ts";
import { ogPalette } from "../src/lib/theme.ts";

const require = createRequire(import.meta.url);

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600 | 700;
  style: "normal";
};

type OgImageResponse = new (
  element: ReactElement,
  options?: {
    width?: number;
    height?: number;
    fonts?: OgFont[];
  },
) => Response;

const { ImageResponse } = require("next/og") as {
  ImageResponse: OgImageResponse;
};

const WIDTH = 1200;
const HEIGHT = 675;
const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const FONT_DIR = path.join(ROOT, "scripts", "fonts");

const EVERGREEN = new Set([
  "review",
  "guia",
  "comparativo",
  "vale-a-pena",
  "tutorial",
]);

/** Folder under `public/covers/`. Review-archive formats share one directory. */
function coverFolder(format: string) {
  if (format === "tutorial") return "tutoriais";
  if (format === "vale-a-pena") return "vale-a-pena";
  return "reviews";
}

/** Category accent on the navy field. Names are used in coverAlt. */
const CATEGORY_ACCENT: Record<
  string,
  { color: string; hue: string }
> = {
  tecnologia: { color: "#D2E25A", hue: "verde-limão" },
  ia: { color: "#7EB4FF", hue: "azul" },
  computadores: { color: "#3DDC97", hue: "verde" },
  dispositivos: { color: "#F0B429", hue: "âmbar" },
  aplicativos: { color: "#C3B4FD", hue: "lilás" },
  jogos: { color: "#FF6B8A", hue: "vermelha" },
};

const FORMAT_LABEL: Record<string, string> = {
  review: "Review",
  guia: "Guia",
  comparativo: "Comparativo",
  "vale-a-pena": "Vale a pena",
  tutorial: "Tutorial",
};

const FORMAT_WORD: Record<string, string> = {
  review: "review",
  guia: "guia",
  comparativo: "comparativo",
  "vale-a-pena": "vale a pena",
  tutorial: "tutorial",
};

type CoverPost = {
  slug: string;
  file: string;
  title: string;
  format: string;
  category: string;
  subcategory?: string;
  cover?: string;
};

function loadFonts(): OgFont[] {
  const bold = path.join(FONT_DIR, "Geist-Bold.ttf");
  const medium = path.join(FONT_DIR, "Geist-Medium.ttf");
  if (!fs.existsSync(bold) || !fs.existsSync(medium)) {
    throw new Error(
      `Fontes Geist ausentes em ${FONT_DIR}. Elas vêm com o script (OFL).`,
    );
  }
  return [
    {
      name: "Geist",
      data: fs.readFileSync(bold),
      weight: 700,
      style: "normal",
    },
    {
      name: "Geist",
      data: fs.readFileSync(medium),
      weight: 500,
      style: "normal",
    },
  ];
}

function readEvergreen(): CoverPost[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data } = matter(raw);
      const format = typeof data.format === "string" ? data.format : "noticia";
      const cover = typeof data.cover === "string" ? data.cover.trim() : "";
      return {
        slug,
        file: path.join(POSTS_DIR, file),
        title: String(data.title ?? ""),
        format,
        category: String(data.category ?? ""),
        subcategory:
          typeof data.subcategory === "string" ? data.subcategory : undefined,
        cover: cover || undefined,
      };
    })
    .filter((post) => EVERGREEN.has(post.format));
}

function isGeneratedCover(cover?: string) {
  return Boolean(cover?.startsWith("/covers/"));
}

function yamlEscape(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

export function coverAltFor(post: CoverPost) {
  const accent = CATEGORY_ACCENT[post.category] ?? {
    color: ogPalette.accent,
    hue: "azul",
  };
  const category = getCategory(post.category);
  const subcategory = post.subcategory
    ? getSubcategory(post.category, post.subcategory)
    : undefined;
  const desk = subcategory?.label ?? category?.label ?? "The Zero";
  const topic = post.title.split(":")[0]?.replace(/\.$/, "").trim() || post.title;
  const formatWord = FORMAT_WORD[post.format] ?? "guia";
  return `Cartaz editorial do The Zero em azul-marinho, com a marca da casa e faixa ${accent.hue} de ${desk}, para o ${formatWord} sobre ${topic}.`;
}

function insertCoverFrontmatter(raw: string, cover: string, coverAlt: string) {
  const start = raw.indexOf("---");
  const end = raw.indexOf("\n---", start + 3);
  if (start !== 0 || end < 0) {
    throw new Error("Frontmatter ausente.");
  }
  const fm = raw.slice(0, end);
  if (/^cover:/m.test(fm)) return raw;
  const lines = `cover: "${yamlEscape(cover)}"\ncoverAlt: "${yamlEscape(coverAlt)}"`;
  return `${fm.trimEnd()}\n${lines}${raw.slice(end)}`;
}

function titleFontSize(title: string) {
  if (title.length > 62) return 40;
  if (title.length > 48) return 44;
  if (title.length > 34) return 50;
  return 56;
}

/** Conservative wrap so a line stays inside the center square crop (~640px). */
function wrapTitle(title: string, fontSize: number) {
  const maxChars = Math.max(16, Math.floor(620 / (fontSize * 0.54)));
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function wordmark(width: number, color: string) {
  const [, , viewW, viewH] = WORDMARK_VIEWBOX.split(" ").map(Number);
  const height = Math.round((width * (viewH ?? 1)) / (viewW ?? 1));
  return React.createElement(
    "svg",
    {
      width,
      height,
      viewBox: WORDMARK_VIEWBOX,
    },
    ...WORDMARK_PATHS.map((d) =>
      React.createElement("path", { key: d, d, fill: color }),
    ),
  );
}

function splitMark(size: number, color: string) {
  return React.createElement(
    "svg",
    { width: size, height: size, viewBox: MARK_VIEWBOX },
    React.createElement("path", { d: MARK_PATH, fill: color }),
  );
}

function coverElement(post: CoverPost) {
  const accent = CATEGORY_ACCENT[post.category]?.color ?? ogPalette.accent;
  const category = getCategory(post.category);
  const subcategory = post.subcategory
    ? getSubcategory(post.category, post.subcategory)
    : undefined;
  const desk = (subcategory?.label ?? category?.label ?? "The Zero").toLocaleUpperCase(
    "pt-BR",
  );
  const formatLabel = FORMAT_LABEL[post.format] ?? "Guia";
  const fontSize = titleFontSize(post.title);
  const lines = wrapTitle(post.title, fontSize);
  const h = React.createElement;

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: ogPalette.bg,
        color: ogPalette.fg,
        position: "relative",
        padding: "72px 280px 64px",
      },
    },
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: WIDTH,
        height: 14,
        background: accent,
        display: "flex",
      },
    }),
    h("div", {
      style: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: WIDTH,
        height: 8,
        background: accent,
        opacity: 0.45,
        display: "flex",
      },
    }),
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: 128,
          left: (WIDTH - 460) / 2,
          display: "flex",
          opacity: 0.16,
        },
      },
      splitMark(460, accent),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 16,
          },
        },
        h(
          "div",
          {
            style: {
              display: "flex",
              background: accent,
              color: ogPalette.bg,
              fontFamily: "Geist",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "8px 12px",
            },
          },
          formatLabel,
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              color: accent,
              fontFamily: "Geist",
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            },
          },
          desk,
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 640,
            marginTop: 28,
          },
        },
        ...lines.map((line) =>
          h(
            "div",
            {
              key: line,
              style: {
                display: "flex",
                justifyContent: "center",
                width: 640,
                fontFamily: "Geist",
                fontWeight: 700,
                fontSize,
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                textAlign: "center",
                color: ogPalette.fg,
              },
            },
            line,
          ),
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            marginTop: 36,
          },
        },
        wordmark(176, ogPalette.fg),
      ),
    ),
  );
}

async function renderWebp(post: CoverPost, fonts: OgFont[]) {
  const image = new ImageResponse(coverElement(post), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const png = Buffer.from(await image.arrayBuffer());
  return sharp(png)
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toBuffer();
}

function parseArgs(argv: string[]) {
  const slugs = new Set<string>();
  let force = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--force") force = true;
    else if (arg === "--slug") {
      const slug = argv[i + 1];
      if (!slug) throw new Error("--slug precisa de um valor.");
      slugs.add(slug);
      i += 1;
    }
  }
  return { force, slugs };
}

async function main() {
  const { force, slugs } = parseArgs(process.argv.slice(2));
  const fonts = loadFonts();
  for (const folder of ["reviews", "tutoriais", "vale-a-pena"]) {
    fs.mkdirSync(path.join(ROOT, "public", "covers", folder), { recursive: true });
  }

  const posts = readEvergreen().filter((post) =>
    slugs.size === 0 ? true : slugs.has(post.slug),
  );
  if (slugs.size > 0 && posts.length !== slugs.size) {
    const found = new Set(posts.map((post) => post.slug));
    const missing = [...slugs].filter((slug) => !found.has(slug));
    throw new Error(`Slug evergreen não encontrado: ${missing.join(", ")}`);
  }

  let written = 0;
  let skippedPhoto = 0;
  let skippedFresh = 0;
  let largest = 0;

  for (const post of posts) {
    const hasForeignCover = Boolean(post.cover) && !isGeneratedCover(post.cover);
    if (hasForeignCover) {
      skippedPhoto += 1;
      continue;
    }

    const folder = coverFolder(post.format);
    const publicPath = `/covers/${folder}/${post.slug}.webp`;
    const filePath = path.join(ROOT, "public", "covers", folder, `${post.slug}.webp`);
    const raw = fs.readFileSync(post.file, "utf8");
    const needsFile = force || !fs.existsSync(filePath);
    const needsFm = !raw.includes(`cover: "${publicPath}"`) && !/^cover:/m.test(
      raw.slice(0, raw.indexOf("\n---", 3)),
    );

    if (!needsFile && !needsFm) {
      skippedFresh += 1;
      continue;
    }

    if (needsFile) {
      const webp = await renderWebp(post, fonts);
      if (webp.length > 250 * 1024) {
        throw new Error(
          `${post.slug}: WebP com ${webp.length} bytes (teto 250 KB).`,
        );
      }
      fs.writeFileSync(filePath, webp);
      largest = Math.max(largest, webp.length);
      written += 1;
    }

    if (needsFm || !/^cover:/m.test(raw.slice(0, raw.indexOf("\n---", 3)))) {
      const alt = coverAltFor(post);
      const next = insertCoverFrontmatter(raw, publicPath, alt);
      if (next !== raw) fs.writeFileSync(post.file, next);
    }
  }

  console.log(
    JSON.stringify(
      {
        evergreen: posts.length,
        written,
        skippedPhoto,
        skippedFresh,
        largestBytes: largest,
        outDir: "public/covers/{reviews,tutoriais,vale-a-pena}",
      },
      null,
      2,
    ),
  );
}

const isDirectRun = process.argv[1]?.includes("generate-review-covers");
if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}

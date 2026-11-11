import { readLocalImageSize, type ImageSize } from "./image-size.ts";
import { articleOgImagePath, coverAlt } from "./seo.ts";

/** Google Discover pede imagem com pelo menos esta largura. */
export const SOCIAL_IMAGE_MIN_WIDTH = 1200;

export const GENERATED_OG_WIDTH = 1200;
export const GENERATED_OG_HEIGHT = 630;
export const GENERATED_OG_TYPE = "image/png" as const;

export type SocialImageType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export type SocialImage = {
  /** Caminho no site, começando com `/`. */
  path: string;
  width: number;
  height: number;
  type: SocialImageType;
  alt: string;
};

export type ImageProbe = (src: string) => ImageSize | undefined;

type Measured = {
  path: string;
  width: number;
  height: number;
  type: SocialImageType;
};

function cleanPath(src: string) {
  return src.split("?")[0] ?? src;
}

export function imageTypeForPath(src: string): SocialImageType | undefined {
  const path = cleanPath(src).toLowerCase();
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return undefined;
}

function isJpegOrPng(type: SocialImageType): boolean {
  return type === "image/jpeg" || type === "image/png";
}

/**
 * Jpeg/png que podem substituir uma capa webp. O mesmo nome vem antes
 * do original `cover.src.*` guardado ao lado da capa travada.
 */
export function jpegPngAlternatives(src: string): string[] {
  const path = cleanPath(src);
  const match = path.match(/^(.*)(\.[^./]+)$/);
  const stem = match?.[1];
  const ext = match?.[2]?.toLowerCase();
  if (!stem || ext !== ".webp") return [];

  const alternatives = [`${stem}.jpg`, `${stem}.jpeg`, `${stem}.png`];
  if (/(^|\/)cover$/i.test(stem)) {
    const dir = stem.slice(0, -"cover".length);
    alternatives.push(
      `${dir}cover.src.jpg`,
      `${dir}cover.src.jpeg`,
      `${dir}cover.src.png`,
    );
  }
  return alternatives;
}

function measure(src: string, probe: ImageProbe): Measured | undefined {
  const type = imageTypeForPath(src);
  if (!type) return undefined;
  const size = probe(src);
  if (!size) return undefined;
  return { path: cleanPath(src), width: size.width, height: size.height, type };
}

function generatedCard(path: string, alt: string): SocialImage {
  return {
    path,
    width: GENERATED_OG_WIDTH,
    height: GENERATED_OG_HEIGHT,
    type: GENERATED_OG_TYPE,
    alt,
  };
}

/**
 * Capa larga o bastante para o Discover. Jpeg e png ganham da webp.
 * Uma capa estreita não é trocada por um irmão maior: quem chama decide
 * o cartão gerado.
 */
function qualifyCover(
  imagePath: string | undefined,
  probe: ImageProbe,
): Measured | undefined {
  if (!imagePath) return undefined;
  const type = imageTypeForPath(imagePath);
  if (!type) return undefined;

  if (isJpegOrPng(type)) return measure(imagePath, probe);

  const self = measure(imagePath, probe);
  if (!self || self.width < SOCIAL_IMAGE_MIN_WIDTH) return self;

  if (type === "image/webp") {
    for (const alternative of jpegPngAlternatives(imagePath)) {
      const sibling = measure(alternative, probe);
      if (
        sibling &&
        isJpegOrPng(sibling.type) &&
        sibling.width >= SOCIAL_IMAGE_MIN_WIDTH
      ) {
        return sibling;
      }
    }
  }

  return self;
}

/**
 * Imagem de `og:image` e `twitter:image`.
 * Jpeg ou png com pelo menos 1200 px de largura, inclusive um irmão da
 * capa webp. A webp entra quando ela mesma passa de 1200 px e não há
 * jpeg/png. Sem capa, ou com capa mais estreita, usa `fallbackPath`.
 * Sem fallback, um arquivo legível sai com o tamanho real; um caminho
 * que não é arquivo (o cartão `/opengraph-image`) continua 1200×630 png.
 */
export function resolveSocialImage(
  input: { imagePath?: string; alt: string; fallbackPath?: string },
  probe: ImageProbe = readLocalImageSize,
): SocialImage | undefined {
  const alt = input.alt;
  const chosen = qualifyCover(input.imagePath, probe);
  if (chosen && chosen.width >= SOCIAL_IMAGE_MIN_WIDTH) return { ...chosen, alt };
  if (input.fallbackPath) return generatedCard(input.fallbackPath, alt);
  if (!input.imagePath) return undefined;
  if (chosen) return { ...chosen, alt };
  return generatedCard(input.imagePath, alt);
}

/** Capa da matéria, ou o cartão gerado quando ela não serve para o Discover. */
export function articleSocialImage(
  post: {
    slug: string;
    title: string;
    cover?: string;
    coverAlt?: string;
  },
  probe: ImageProbe = readLocalImageSize,
): SocialImage {
  const alt = coverAlt(post.title, post.coverAlt);
  const fallbackPath = articleOgImagePath(post.slug);
  return (
    resolveSocialImage({ imagePath: post.cover, alt, fallbackPath }, probe) ??
    generatedCard(fallbackPath, alt)
  );
}

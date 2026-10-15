import { readLocalImageSize } from "./image-size.ts";
import {
  articleOgImagePath,
  assetUrl,
  coverAlt,
} from "./seo.ts";
import { absoluteUrl } from "./site.ts";
import { derivedImagePath, type CoverRatio } from "./derived-image.ts";

const RATIO_SIZES: Record<CoverRatio, [number, number]> = {
  "16x9": [1200, 675],
  "4x3": [1200, 900],
  "1x1": [1200, 1200],
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type ArticleImage = {
  url: string;
  width?: number;
  height?: number;
  caption: string;
};

/**
 * Images for NewsArticle and the sitemap.
 * The cover is the photo on the page. The generated card is a second,
 * always-on-domain file Google can fetch when the cover host blocks crawlers.
 * Local covers also list the 16:9, 4:3 and 1:1 WebP crops that
 * scripts/derive-covers.mjs writes before every build (real files).
 */
export function articleImages(post: {
  slug: string;
  title: string;
  cover?: string;
  coverAlt?: string;
}): ArticleImage[] {
  const images: ArticleImage[] = [];
  const cover = assetUrl(post.cover);
  if (cover) {
    const size = readLocalImageSize(post.cover);
    images.push({
      url: cover,
      ...(size ? { width: size.width, height: size.height } : {}),
      caption: coverAlt(post.title, post.coverAlt),
    });
  }

  const caption = coverAlt(post.title, post.coverAlt);
  for (const ratio of ["16x9", "4x3", "1x1"] as const) {
    const derived = derivedImagePath(post.cover, ratio);
    if (!derived) break;
    const [width, height] = RATIO_SIZES[ratio];
    images.push({ url: absoluteUrl(derived), width, height, caption });
  }

  const card = absoluteUrl(articleOgImagePath(post.slug));
  if (!images.some((image) => image.url === card)) {
    images.push({
      url: card,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      caption: post.title,
    });
  }
  return images;
}

export function articleImageUrls(post: {
  slug: string;
  cover?: string;
}): string[] {
  return articleImages({ ...post, title: "" }).map((image) => image.url);
}

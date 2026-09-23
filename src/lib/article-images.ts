import { readLocalImageSize } from "./image-size.ts";
import {
  articleOgImagePath,
  assetUrl,
  coverAlt,
} from "./seo.ts";
import { absoluteUrl } from "./site.ts";

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
 * We do not invent 16:9 / 4:3 / 1:1 derivatives that are not files.
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

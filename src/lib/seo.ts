import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";

export const newsRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export function languageAlternate(path = "/") {
  return { "pt-BR": path } as const;
}

export function assetUrl(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(src);
}

export function ogImageMeta(url: string, alt: string) {
  return {
    url,
    width: 1200,
    height: 630,
    alt,
    type: "image/png" as const,
  };
}

export function coverAlt(title: string, customAlt?: string) {
  return customAlt?.trim() || title;
}

export function articleOgImagePath(slug: string) {
  return `/noticia/${slug}/opengraph-image`;
}

export const publisherLogoUrl = `${site.url}/apple-icon`;
export const organizationId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

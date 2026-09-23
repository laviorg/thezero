import type { Metadata } from "next";
import { absoluteUrl, site } from "./site.ts";

/** Visible home crumb. JSON-LD must use the same label as the trail on the page. */
export const HOME_CRUMB_LABEL = "Newsroom";

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
  return { "pt-BR": path, "x-default": path } as const;
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

/**
 * Author node Google can read without resolving `@id` across script tags.
 * The house byline is the organization. A named person only gets a URL when
 * we actually have a profile page — `/sobre` identifies the newsroom, not a guest.
 */
export function articleAuthorLd(author: string) {
  const name = author.trim();
  if (!name || name === site.defaultAuthor) {
    return {
      "@type": "Organization" as const,
      "@id": organizationId,
      name: site.name,
      url: site.url,
    };
  }
  return {
    "@type": "Person" as const,
    name,
  };
}

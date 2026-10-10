import type { Metadata } from "next";
import { resolveAuthor } from "./authors.ts";
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

/** Google’s usual meta description cutoff. We stay under it on purpose. */
export const META_DESCRIPTION_MAX = 155;

const META_ELLIPSIS = "…";

/**
 * SERP description. Keeps the text when it already fits; otherwise cuts on a
 * word boundary and appends an ellipsis so the tag stays ≤155 characters.
 * The long dek on the page is a different string.
 */
export function toMetaDescription(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if ([...text].length <= META_DESCRIPTION_MAX) return text;

  const budget = META_DESCRIPTION_MAX - [...META_ELLIPSIS].length;
  let slice = [...text].slice(0, budget).join("");
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > 0) slice = slice.slice(0, lastSpace);
  slice = slice.trimEnd().replace(/(?<!\d)[.,;:!?]+$/u, "").trimEnd();
  if (!slice) {
    slice = [...text].slice(0, budget).join("").trimEnd();
  }
  return `${slice}${META_ELLIPSIS}`;
}

/**
 * Editorias, subeditorias and review lines with fewer stories are thin:
 * noindex and absent from the sitemap until they reach this count.
 */
export const MIN_INDEXABLE_HUB_POSTS = 3;

export function isIndexableHub(postCount: number): boolean {
  return postCount >= MIN_INDEXABLE_HUB_POSTS;
}

export const publisherLogoUrl = `${site.url}/apple-icon`;
export const organizationId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

/**
 * Author node Google can read without resolving `@id` across script tags.
 * The house byline is the organization. Named authors point to `/autores#<slug>`.
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
  const profile = resolveAuthor(name);
  if (profile) {
    return {
      "@type": "Person" as const,
      name: profile.name,
      url: absoluteUrl(profile.href),
      description: profile.role,
    };
  }
  return {
    "@type": "Person" as const,
    name,
  };
}

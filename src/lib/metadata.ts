import type { Metadata } from "next";
import {
  languageAlternate,
  newsRobots,
  ogImageMeta,
  toMetaDescription,
} from "./seo.ts";
import { absoluteUrl, site } from "./site.ts";
import {
  BRAND_NAME,
  TITLE_SEPARATOR,
  composePageTitle,
  includesBrand,
  type BrandMode,
} from "./titles.ts";

type BuildPageMetaInput = {
  /** Núcleo ou title absoluto. A marca segue `brand`, salvo se o texto já a contém. */
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  brand?: BrandMode;
  noIndex?: boolean;
  ogTitle?: string;
  imagePath?: string;
  imageAlt?: string;
  /** 404 and other non-URLs must not canonicalize to a path that does not exist. */
  omitCanonical?: boolean;
};

/**
 * The root layout template is `%s · The Zero`. Pass the core as a string so
 * Next adds that suffix. When the composed title would pass 60 characters,
 * or the brand is already inside the core, emit an absolute title and the
 * template stays out of the way.
 */
function metadataTitle(documentTitle: string): Metadata["title"] {
  const suffix = `${TITLE_SEPARATOR}${BRAND_NAME}`;
  if (documentTitle.endsWith(suffix)) {
    const core = documentTitle.slice(0, -suffix.length);
    if (core && !includesBrand(core)) return core;
  }
  return { absolute: documentTitle };
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  brand = "auto",
  noIndex = false,
  ogTitle,
  imagePath,
  imageAlt,
  omitCanonical = false,
}: BuildPageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const canonicalUrl = url;
  const documentTitle = composePageTitle(title, brand);
  const metaDescription = toMetaDescription(description);
  const socialTitle = ogTitle
    ? composePageTitle(ogTitle, includesBrand(ogTitle) ? "never" : brand)
    : documentTitle;
  const image = imagePath
    ? ogImageMeta(absoluteUrl(imagePath), imageAlt ?? socialTitle)
    : undefined;

  return {
    title: metadataTitle(documentTitle),
    description: metaDescription,
    alternates: {
      ...(omitCanonical
        ? {}
        : {
            canonical: canonicalUrl,
            languages: languageAlternate(canonicalUrl),
          }),
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : newsRobots,
    openGraph: {
      type,
      locale: site.locale,
      url,
      siteName: site.name,
      title: socialTitle,
      description: metaDescription,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: metaDescription,
      ...(image
        ? { images: [{ url: image.url, alt: image.alt }] }
        : {}),
    },
  };
}

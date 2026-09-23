import type { Metadata } from "next";
import {
  languageAlternate,
  newsRobots,
  ogImageMeta,
} from "./seo.ts";
import { absoluteUrl, site } from "./site.ts";
import {
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
  const documentTitle = composePageTitle(title, brand);
  const socialTitle = ogTitle
    ? composePageTitle(ogTitle, includesBrand(ogTitle) ? "never" : brand)
    : documentTitle;
  const image = imagePath
    ? ogImageMeta(absoluteUrl(imagePath), imageAlt ?? socialTitle)
    : undefined;

  return {
    title: { absolute: documentTitle },
    description,
    alternates: {
      ...(omitCanonical
        ? {}
        : {
            canonical: path,
            languages: languageAlternate(path),
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
      description,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(image
        ? { images: [{ url: image.url, alt: image.alt }] }
        : {}),
    },
  };
}

import {
  languageAlternate,
  newsRobots,
  ogImageMeta,
} from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import {
  composePageTitle,
  includesBrand,
  type BrandMode,
} from "@/lib/titles";
import type { Metadata } from "next";

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
      canonical: path,
      languages: languageAlternate(path),
    },
    robots: noIndex ? { index: false, follow: true } : newsRobots,
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
      ...(image ? { images: [image.url] } : {}),
    },
  };
}

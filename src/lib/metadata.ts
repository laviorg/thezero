import {
  languageAlternate,
  newsRobots,
  ogImageMeta,
} from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";

type BuildPageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
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
  absoluteTitle = false,
  noIndex = false,
  ogTitle,
  imagePath,
  imageAlt,
}: BuildPageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = ogTitle ?? (absoluteTitle ? title : `${title} · ${site.name}`);
  const image = imagePath
    ? ogImageMeta(absoluteUrl(imagePath), imageAlt ?? socialTitle)
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
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

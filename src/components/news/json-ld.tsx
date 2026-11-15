import type { ArticleImage } from "@/lib/article-images";
import {
  aboutPageJsonLd,
  homeWebPageJsonLd,
  organizationJsonLd,
  publisherJsonLd,
  websiteJsonLd,
} from "@/lib/entity-jsonld";
import { articleAuthorLd, organizationId, websiteId } from "@/lib/seo";
import { site } from "@/lib/site";
import { CONTACT_TITLE } from "@/lib/titles";

function jsonLdHtml(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }}
    />
  );
}

const publisher = publisherJsonLd;

export function OrganizationJsonLd() {
  return <JsonLd data={organizationJsonLd()} />;
}

export function WebsiteJsonLd() {
  return <JsonLd data={websiteJsonLd()} />;
}

export function NewsArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  section,
  author,
  images,
  wordCount,
  readingMinutes,
  keywords,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  section: string;
  author: string;
  images: ArticleImage[];
  wordCount?: number;
  readingMinutes?: number;
  keywords?: string[];
}) {
  const primaryImage = images[0]?.url;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline,
        description,
        datePublished,
        dateModified,
        inLanguage: site.language,
        articleSection: section,
        ...(keywords?.length ? { keywords } : {}),
        isAccessibleForFree: true,
        image: images.map((image) => ({
          "@type": "ImageObject",
          url: image.url,
          ...(image.width && image.height
            ? { width: image.width, height: image.height }
            : {}),
          caption: image.caption,
        })),
        ...(primaryImage ? { thumbnailUrl: primaryImage } : {}),
        ...(wordCount ? { wordCount } : {}),
        ...(readingMinutes
          ? { timeRequired: `PT${readingMinutes}M` }
          : {}),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        isPartOf: { "@id": websiteId },
        author: [articleAuthorLd(author)],
        publisher,
        url,
      }}
    />
  );
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: item.url,
            name: item.name,
          })),
        },
      }}
    />
  );
}

export function ItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        isPartOf: { "@id": websiteId },
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: item.url,
          name: item.name,
        })),
      }}
    />
  );
}

export function AboutPageJsonLd({ description }: { description: string }) {
  return <JsonLd data={aboutPageJsonLd(description)} />;
}

export function ContactPageJsonLd({ description }: { description: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${site.url}/contato#webpage`,
        url: `${site.url}/contato`,
        name: CONTACT_TITLE,
        description,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        mainEntity: {
          "@type": "ContactPoint",
          contactType: "editorial",
          email: site.email,
          url: `${site.url}/contato`,
          availableLanguage: ["Portuguese"],
        },
      }}
    />
  );
}

export function TrustPageJsonLd({
  path,
  name,
  description,
}: {
  path: "/como-testamos" | "/politica-editorial";
  name: string;
  description: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${site.url}${path}#webpage`,
        url: `${site.url}${path}`,
        name,
        description,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        about: { "@id": organizationId },
      }}
    />
  );
}

export function LegalPageJsonLd({
  path,
  name,
  description,
}: {
  path: "/privacidade" | "/termos";
  name: string;
  description: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${site.url}${path}#webpage`,
        url: `${site.url}${path}`,
        name,
        description,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        about: { "@id": organizationId },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/** Home as the brand entity's page: WebPage about the newsroom at `/`. */
export function HomePageJsonLd() {
  return <JsonLd data={homeWebPageJsonLd()} />;
}

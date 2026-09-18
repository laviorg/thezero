import {
  organizationId,
  publisherLogoUrl,
  websiteId,
} from "@/lib/seo";
import { site } from "@/lib/site";

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const publisher = {
  "@type": "NewsMediaOrganization" as const,
  "@id": organizationId,
  name: site.name,
  url: site.url,
  logo: {
    "@type": "ImageObject" as const,
    url: publisherLogoUrl,
    width: 180,
    height: 180,
  },
};

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        "@id": organizationId,
        name: site.name,
        url: site.url,
        logo: publisher.logo,
        description: site.description,
        email: site.email,
        sameAs: [site.social.instagram, site.social.youtube],
        inLanguage: site.language,
        areaServed: {
          "@type": "Country",
          name: "Brasil",
        },
        publishingPrinciples: `${site.url}/sobre`,
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": websiteId,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: site.language,
        publisher: { "@id": organizationId },
      }}
    />
  );
}

export function NewsArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  section,
  author,
  image,
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
  image: string;
  wordCount?: number;
  readingMinutes?: number;
  keywords?: string[];
}) {
  const articleAuthor =
    author === site.defaultAuthor
      ? { "@id": organizationId }
      : { "@type": "Person" as const, name: author };

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
        image: [
          {
            "@type": "ImageObject",
            url: image,
            width: 1200,
            height: 630,
            caption: headline,
          },
        ],
        thumbnailUrl: image,
        ...(wordCount ? { wordCount } : {}),
        ...(readingMinutes
          ? { timeRequired: `PT${readingMinutes}M` }
          : {}),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        isPartOf: { "@id": websiteId },
        author: articleAuthor,
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
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${site.url}/sobre#webpage`,
        url: `${site.url}/sobre`,
        name: `Sobre · ${site.name}`,
        description,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
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

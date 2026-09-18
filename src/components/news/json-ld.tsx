import { site } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/logo-on-light.svg`,
    description: site.description,
    sameAs: [site.social.instagram, site.social.youtube],
    inLanguage: site.language,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.language,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/busca?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  section: string;
  author: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    datePublished,
    dateModified,
    inLanguage: site.language,
    articleSection: section,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: author,
      url: site.url,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/logo-on-light.svg`,
      },
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

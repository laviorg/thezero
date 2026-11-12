import { organizationId, publisherLogoUrl, websiteId } from "./seo.ts";
import { absoluteUrl, site } from "./site.ts";
import { ABOUT_TITLE, HOME_TITLE } from "./titles.ts";

const logo = {
  "@type": "ImageObject" as const,
  url: publisherLogoUrl,
  width: 512,
  height: 512,
};

/** NewsArticle publisher. Same homepage URL as the Organization node. */
export const publisherJsonLd = {
  "@type": "NewsMediaOrganization" as const,
  "@id": organizationId,
  name: site.name,
  url: absoluteUrl("/"),
  logo,
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization" as const,
    "@id": organizationId,
    name: site.name,
    url: absoluteUrl("/"),
    logo,
    slogan: site.slogan,
    description: site.description,
    email: site.email,
    sameAs: [
      site.social.instagram,
      site.social.youtube,
      site.social.threads,
      site.social.x,
      site.social.pinterest,
    ].filter((url) => url.startsWith("https://")),
    inLanguage: site.language,
    areaServed: {
      "@type": "Country" as const,
      name: "Brasil",
    },
    publishingPrinciples: `${site.url}/politica-editorial`,
    correctionsPolicy: `${site.url}/politica-editorial#correcoes`,
    ethicsPolicy: `${site.url}/como-testamos`,
    ownershipFundingInfo: `${site.url}/sobre#quem-publica`,
    actionableFeedbackPolicy: `${site.url}/contato`,
    masthead: `${site.url}/sobre`,
    contactPoint: {
      "@type": "ContactPoint" as const,
      contactType: "editorial",
      email: site.email,
      url: `${site.url}/contato`,
      availableLanguage: ["Portuguese"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite" as const,
    "@id": websiteId,
    name: site.name,
    alternateName: ["TheZero", "thezero.com.br"],
    url: absoluteUrl("/"),
    slogan: site.slogan,
    description: site.description,
    inLanguage: site.language,
    publisher: { "@id": organizationId },
  };
}

export function homeWebPageJsonLd() {
  const url = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebPage" as const,
    "@id": `${url}#webpage`,
    url,
    name: HOME_TITLE,
    description: site.description,
    inLanguage: site.language,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    publisher: { "@id": organizationId },
  };
}

export function aboutPageJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage" as const,
    "@id": `${site.url}/sobre#webpage`,
    url: `${site.url}/sobre`,
    name: ABOUT_TITLE,
    description,
    inLanguage: site.language,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
  };
}

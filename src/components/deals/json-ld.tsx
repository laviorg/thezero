import { organizationId, websiteId } from "@/lib/seo";
import { site } from "@/lib/site";

export function GuidePageJsonLd({
  path,
  name,
  description,
  image,
  dateModified,
  items,
  faq,
}: {
  path: string;
  name: string;
  description: string;
  image: string;
  dateModified: string;
  items: { name: string; url: string }[];
  faq?: { q: string; a: string }[];
}) {
  const url = `${site.url}${path}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: site.language,
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}${image}`, width: 1200, height: 630 },
      dateModified,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Newsroom", item: site.url },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    },
  ];
  if (items.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#produtos`,
      name: `Produtos citados — ${name}`,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    });
  }
  if (faq && faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: { "@type": "Answer", text: entry.a },
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}

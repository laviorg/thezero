/** Google News sitemaps only include articles from the last two days. */
export const NEWS_SITEMAP_MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000;

export type NewsSitemapEntry = {
  loc: string;
  title: string;
  publicationDate: string;
  images?: string[];
};

export function selectRecentPublications<T extends { dateIso: string }>(
  posts: T[],
  now = Date.now(),
): T[] {
  return posts.filter((post) => {
    const publishedAt = new Date(post.dateIso).getTime();
    return (
      Number.isFinite(publishedAt) &&
      publishedAt <= now &&
      now - publishedAt <= NEWS_SITEMAP_MAX_AGE_MS
    );
  });
}

/** Google News only. Evergreen formats stay in the regular sitemap. */
export function selectGoogleNewsPosts<
  T extends { dateIso: string; format?: string },
>(posts: T[], now = Date.now()): T[] {
  return selectRecentPublications(
    posts.filter((post) => (post.format ?? "noticia") === "noticia"),
    now,
  );
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildNewsSitemapXml(
  entries: NewsSitemapEntry[],
  publicationName: string,
): string {
  const urls = entries
    .map((entry) => {
      const images = (entry.images ?? [])
        .filter(Boolean)
        .map(
          (url) => `<image:image>
      <image:loc>${escapeXml(url)}</image:loc>
    </image:image>`,
        )
        .join("\n    ");
      return `<url>
    <loc>${escapeXml(entry.loc)}</loc>
    ${images}
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(entry.publicationDate)}</news:publication_date>
      <news:title>${escapeXml(entry.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n  ");

  const body = urls ? `\n  ${urls}\n` : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
}

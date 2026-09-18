import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const revalidate = 3600;

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const now = Date.now();
  const recentPosts = getAllPosts().filter((post) => {
    const publishedAt = new Date(post.dateIso).getTime();
    return publishedAt <= now && publishedAt >= now - TWO_DAYS;
  });

  const urls = recentPosts
    .map(
      (post) => `<url>
    <loc>${escapeXml(`${site.url}${post.href}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.name)}</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(post.dateIso)}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n  ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

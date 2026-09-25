import { getNewsPosts, latestUpdatedDate } from "@/lib/posts";
import { assetUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function imageMime(url: string) {
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export function GET() {
  const posts = getNewsPosts();
  const built = (latestUpdatedDate(posts) ?? new Date()).toUTCString();
  const feedUrl = `${site.url}/rss.xml`;

  const items = posts
    .map((post) => {
      const url = `${site.url}${post.href}`;
      const image = assetUrl(post.cover);
      const media = image
        ? `<media:content url="${escapeXml(image)}" medium="image" type="${imageMime(image)}" />`
        : "";
      return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.dateIso).toUTCString()}</pubDate>
      <dc:date>${escapeXml(post.updatedIso)}</dc:date>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.categoryLabel)}</category>
      ${post.subcategoryLabel ? `<category>${escapeXml(post.subcategoryLabel)}</category>` : ""}
      <author>${escapeXml(site.email)} (${escapeXml(post.author)})</author>
      ${media}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>pt-BR</language>
    <image>
      <url>${site.url}/icon</url>
      <title>${escapeXml(site.name)}</title>
      <link>${site.url}</link>
      <width>32</width>
      <height>32</height>
    </image>
    <lastBuildDate>${built}</lastBuildDate>
    <ttl>60</ttl>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(site.name)}</copyright>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

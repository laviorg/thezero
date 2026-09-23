import { articleImageUrls } from "@/lib/article-images";
import {
  buildNewsSitemapXml,
  selectRecentPublications,
} from "@/lib/news-sitemap";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";

export const revalidate = 300;

export function GET() {
  const entries = selectRecentPublications(getAllPosts()).map((post) => ({
    loc: absoluteUrl(post.href),
    title: post.title,
    publicationDate: post.dateIso,
    images: articleImageUrls(post),
  }));

  return new Response(buildNewsSitemapXml(entries, site.name), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

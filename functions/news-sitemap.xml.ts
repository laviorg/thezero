import {
  buildNewsSitemapXml,
  selectGoogleNewsPosts,
} from "../src/lib/news-sitemap.ts";

type ManifestPost = {
  loc: string;
  title: string;
  dateIso: string;
  format?: string;
  images?: string[];
};

type Manifest = {
  publication: string;
  posts: ManifestPost[];
};

type AssetContext = {
  request: Request;
  env: {
    ASSETS: { fetch: (input: Request | string) => Promise<Response> };
  };
};

const HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
};

async function xml(context: AssetContext): Promise<string> {
  const manifestUrl = new URL("/news-manifest.json", context.request.url);
  const response = await context.env.ASSETS.fetch(new Request(manifestUrl));
  if (!response.ok) {
    throw new Error(`news-manifest.json ${response.status}`);
  }
  const manifest = (await response.json()) as Manifest;
  const entries = selectGoogleNewsPosts(manifest.posts).map((post) => ({
    loc: post.loc,
    title: post.title,
    publicationDate: post.dateIso,
    images: post.images,
  }));
  return buildNewsSitemapXml(entries, manifest.publication);
}

export async function onRequest(context: AssetContext): Promise<Response> {
  const method = context.request.method;
  if (method !== "GET" && method !== "HEAD") {
    return new Response(null, { status: 405, headers: HEADERS });
  }

  try {
    const body = await xml(context);
    return new Response(method === "HEAD" ? null : body, {
      status: 200,
      headers: HEADERS,
    });
  } catch {
    return new Response("news sitemap indisponível", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

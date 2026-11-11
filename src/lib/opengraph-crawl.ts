/**
 * Generated Open Graph cards (`opengraph-image.tsx`). They are images for
 * link previews, not documents. Search crawlers were fetching the route as a
 * page and spending crawl budget on it.
 *
 * robots.txt `*` matches any character, including `/`, so the two Disallow
 * paths cover `/opengraph-image` and `/noticia/<slug>/opengraph-image`.
 * Cloudflare `_headers` placeholders do not cross `/`, so the header rules
 * list each depth that exists. A splat is not repeated: Pages allows one
 * `*` per rule, and a second overlapping rule would comma-join Content-Type.
 */

export const OPENGRAPH_ROBOTS_TAG = "noindex, nofollow";

export const OPENGRAPH_ROBOTS_DISALLOW = [
  "/opengraph-image",
  "/*/opengraph-image",
] as const;

/**
 * Link-preview crawlers honor robots.txt. They need their own group, with
 * no Disallow, or WhatsApp, Instagram and Facebook never download the PNG.
 * X-Robots-Tag on the response still tells a search crawler that fetched the
 * file not to index that URL.
 */
export const LINK_PREVIEW_USER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "WhatsApp",
  "LinkedInBot",
  "TelegramBot",
  "Slackbot",
  "Discordbot",
  "Pinterestbot",
  "Applebot",
] as const;

export type RobotsRule = {
  userAgent: string | string[];
  allow: "/";
  disallow?: string[];
};

export function openGraphRobotsRules(): RobotsRule[] {
  return [
    { userAgent: "Mediapartners-Google", allow: "/" },
    { userAgent: "Google-Display-Ads-Bot", allow: "/" },
    { userAgent: [...LINK_PREVIEW_USER_AGENTS], allow: "/" },
    {
      userAgent: "*",
      allow: "/",
      disallow: [...OPENGRAPH_ROBOTS_DISALLOW],
    },
  ];
}

/** Depths served today: `/opengraph-image`, `/{section}/opengraph-image`, `/{a}/{b}/opengraph-image`. */
export const OPENGRAPH_HEADER_PATHS = [
  "/opengraph-image",
  "/:section/opengraph-image",
  "/:section/:leaf/opengraph-image",
] as const;

export function cloudflareOpenGraphHeaderBlock(): string {
  return OPENGRAPH_HEADER_PATHS.map(
    (path) =>
      `${path}\n  Content-Type: image/png\n  X-Robots-Tag: ${OPENGRAPH_ROBOTS_TAG}`,
  ).join("\n");
}

export function nextOpenGraphHeaders(): {
  source: string;
  headers: { key: string; value: string }[];
}[] {
  return ["/opengraph-image", "/:path+/opengraph-image"].map((source) => ({
    source,
    headers: [{ key: "X-Robots-Tag", value: OPENGRAPH_ROBOTS_TAG }],
  }));
}

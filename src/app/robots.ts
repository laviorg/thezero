import { openGraphRobotsRules } from "@/lib/opengraph-crawl";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: openGraphRobotsRules(),
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/news-sitemap.xml`],
  };
}

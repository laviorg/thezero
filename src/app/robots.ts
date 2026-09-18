import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/busca"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.domain,
  };
}

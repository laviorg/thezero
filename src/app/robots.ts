import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "Google-Display-Ads-Bot",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/news-sitemap.xml`],
  };
}

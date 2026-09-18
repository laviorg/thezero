import { categoryList } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/sobre`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categories = categoryList.map((category) => ({
    url: `${site.url}${category.href}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${site.url}${post.href}`,
    lastModified: new Date(post.updatedIso),
    changeFrequency: "weekly" as const,
    priority: post.featured ? 0.9 : 0.7,
  }));

  return [...staticEntries, ...categories, ...posts];
}

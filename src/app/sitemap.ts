import { categoryList } from "@/lib/categories";
import { getAllPosts, getLatestModifiedDate, getPostsByCategory } from "@/lib/posts";
import { assetUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const contentFreshness = getLatestModifiedDate();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: contentFreshness,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/sobre`,
      lastModified: contentFreshness,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categories = categoryList.map((category) => {
    const latest = getPostsByCategory(category.slug)[0];
    return {
      url: `${site.url}${category.href}`,
      lastModified: latest ? new Date(latest.updatedIso) : contentFreshness,
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  const postEntries = posts.map((post) => {
    const image = assetUrl(post.cover);
    return {
      url: `${site.url}${post.href}`,
      lastModified: new Date(post.updatedIso),
      changeFrequency: "weekly" as const,
      priority: post.featured ? 0.9 : 0.7,
      ...(image ? { images: [image] } : {}),
    };
  });

  return [...staticEntries, ...categories, ...postEntries];
}

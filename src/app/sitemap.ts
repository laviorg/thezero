import { articleImageUrls } from "@/lib/article-images";
import { categoryList } from "@/lib/categories";
import {
  getActiveSubcategories,
  getAllPosts,
  getPostsByCategory,
  getPostsBySubcategory,
  getReviewPosts,
  latestUpdatedDate,
} from "@/lib/posts";
import { site } from "@/lib/site";
import { assertUniqueDocumentTitles } from "@/lib/title-audit";
import type { MetadataRoute } from "next";

function languageAlternates(url: string) {
  return {
    languages: {
      "pt-BR": url,
      "x-default": url,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  assertUniqueDocumentTitles();
  const posts = getAllPosts();
  const contentFreshness = latestUpdatedDate(posts);

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: site.url,
      ...(contentFreshness ? { lastModified: contentFreshness } : {}),
      alternates: languageAlternates(site.url),
    },
    {
      url: `${site.url}/sobre`,
      alternates: languageAlternates(`${site.url}/sobre`),
    },
    {
      url: `${site.url}/contato`,
      alternates: languageAlternates(`${site.url}/contato`),
    },
    {
      url: `${site.url}/privacidade`,
      alternates: languageAlternates(`${site.url}/privacidade`),
    },
    {
      url: `${site.url}/termos`,
      alternates: languageAlternates(`${site.url}/termos`),
    },
  ];

  const reviewPosts = getReviewPosts();
  const reviewsUpdated = latestUpdatedDate(reviewPosts);
  const reviews =
    reviewPosts.length === 0
      ? []
      : [
          {
            url: `${site.url}/reviews`,
            ...(reviewsUpdated ? { lastModified: reviewsUpdated } : {}),
            alternates: languageAlternates(`${site.url}/reviews`),
          },
        ];

  const categories = categoryList.flatMap((category) => {
    const categoryPosts = getPostsByCategory(category.slug);
    if (categoryPosts.length === 0) return [];
    const url = `${site.url}${category.href}`;
    const lastModified = latestUpdatedDate(categoryPosts);
    return [
      {
        url,
        ...(lastModified ? { lastModified } : {}),
        alternates: languageAlternates(url),
      },
    ];
  });

  const subcategories = getActiveSubcategories().flatMap((subcategory) => {
    const subcategoryPosts = getPostsBySubcategory(
      subcategory.parent,
      subcategory.slug,
    );
    if (subcategoryPosts.length === 0) return [];
    const url = `${site.url}${subcategory.href}`;
    const lastModified = latestUpdatedDate(subcategoryPosts);
    return [
      {
        url,
        ...(lastModified ? { lastModified } : {}),
        alternates: languageAlternates(url),
      },
    ];
  });

  const postEntries = posts.map((post) => {
    const url = `${site.url}${post.href}`;
    return {
      url,
      lastModified: new Date(post.updatedIso),
      alternates: languageAlternates(url),
      images: articleImageUrls(post),
    };
  });

  return [
    ...staticEntries,
    ...reviews,
    ...categories,
    ...subcategories,
    ...postEntries,
  ];
}

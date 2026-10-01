import { execFileSync } from "node:child_process";
import { articleImageUrls } from "@/lib/article-images";
import { categoryList } from "@/lib/categories";
import {
  getActiveSubcategories,
  getAllPosts,
  getPostsByCategory,
  getPostsByFormat,
  getPostsBySubcategory,
  groupReviewPosts,
  latestUpdatedDate,
} from "@/lib/posts";
import { isIndexableHub } from "@/lib/seo";
import { site } from "@/lib/site";
import { assertUniqueDocumentTitles } from "@/lib/title-audit";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const STATIC_PAGE_SOURCES = [
  { path: "/sobre", file: "src/app/sobre/page.tsx" },
  { path: "/contato", file: "src/app/contato/page.tsx" },
  { path: "/privacidade", file: "src/app/privacidade/page.tsx" },
  { path: "/termos", file: "src/app/termos/page.tsx" },
  { path: "/como-testamos", file: "src/app/como-testamos/page.tsx" },
  { path: "/politica-editorial", file: "src/app/politica-editorial/page.tsx" },
] as const;

function gitCommitDate(args: string[]): Date | undefined {
  try {
    const iso = execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) return date;
  } catch {
    // Shallow builds without history fall through to HEAD, then a fixed date.
  }
  return undefined;
}

function staticPageLastModified(file: string): Date {
  return (
    gitCommitDate(["log", "-1", "--format=%cI", "--", file]) ??
    gitCommitDate(["log", "-1", "--format=%cI"]) ??
    new Date("2026-09-27T00:00:00-03:00")
  );
}

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
    ...STATIC_PAGE_SOURCES.map((page) => {
      const url = `${site.url}${page.path}`;
      return {
        url,
        lastModified: staticPageLastModified(page.file),
        alternates: languageAlternates(url),
      };
    }),
  ];

  const { groups: reviewGroups, rest: reviewRest } = groupReviewPosts();
  const reviewPosts = [
    ...reviewGroups.flatMap((group) => group.posts),
    ...reviewRest,
  ];
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

  const valeAPenaPosts = getPostsByFormat("vale-a-pena");
  const valeAPenaUpdated = latestUpdatedDate(valeAPenaPosts);
  const valeAPena =
    valeAPenaPosts.length === 0
      ? []
      : [
          {
            url: `${site.url}/vale-a-pena`,
            ...(valeAPenaUpdated ? { lastModified: valeAPenaUpdated } : {}),
            alternates: languageAlternates(`${site.url}/vale-a-pena`),
          },
        ];

  const tutorialPosts = getPostsByFormat("tutorial");
  const tutorialsUpdated = latestUpdatedDate(tutorialPosts);
  const tutorials =
    tutorialPosts.length === 0
      ? []
      : [
          {
            url: `${site.url}/tutoriais`,
            ...(tutorialsUpdated ? { lastModified: tutorialsUpdated } : {}),
            alternates: languageAlternates(`${site.url}/tutoriais`),
          },
        ];

  const reviewLines = reviewGroups.flatMap((group) => {
    if (!isIndexableHub(group.posts.length)) return [];
    const url = `${site.url}${group.bucket.href}`;
    const lastModified = latestUpdatedDate(group.posts);
    return [
      {
        url,
        ...(lastModified ? { lastModified } : {}),
        alternates: languageAlternates(url),
      },
    ];
  });

  const categories = categoryList.flatMap((category) => {
    const categoryPosts = getPostsByCategory(category.slug);
    if (!isIndexableHub(categoryPosts.length)) return [];
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
    if (!isIndexableHub(subcategoryPosts.length)) return [];
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
    ...reviewLines,
    ...valeAPena,
    ...tutorials,
    ...categories,
    ...subcategories,
    ...postEntries,
  ];
}

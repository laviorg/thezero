import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CATEGORY_SLUGS,
  SUBCATEGORY_SLUGS,
  getCategory,
  getSubcategory,
  isCategorySlug,
  subcategoryList,
  type CategorySlug,
  type Subcategory,
  type SubcategorySlug,
} from "@/lib/categories";
import { readingTimeMinutes, toIsoDate } from "@/lib/format";
import {
  isEvergreenFormat,
  isNewsFormat,
  parsePostFormat,
  type PostFormat,
} from "@/lib/post-format";
import { site } from "@/lib/site";

export { isEvergreenFormat, isNewsFormat, type PostFormat };

export type PostFrontmatter = {
  title: string;
  /** Núcleo do `<title>` / OG quando a manchete é longa demais para a SERP. */
  seoTitle?: string;
  excerpt: string;
  category: CategorySlug;
  subcategory?: SubcategorySlug;
  date: string;
  updated?: string;
  author?: string;
  featured?: boolean;
  featuredPriority?: number;
  draft?: boolean;
  kicker?: string;
  cover?: string;
  coverAlt?: string;
  coverCredit?: string;
  /**
   * Orthogonal to editoria. Omitted frontmatter stays `noticia`.
   * `review` | `guia` | `comparativo` are evergreen and stay off the news stream.
   */
  format: PostFormat;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingMinutes: number;
  wordCount: number;
  href: string;
  categoryLabel: string;
  subcategoryLabel?: string;
  subcategoryHref?: string;
  author: string;
  dateIso: string;
  updatedIso: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function parseFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const title = typeof data.title === "string" ? data.title : "";
  const seoTitleRaw = typeof data.seoTitle === "string" ? data.seoTitle.trim() : "";
  const seoTitle = seoTitleRaw && seoTitleRaw !== title ? seoTitleRaw : undefined;
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
  const category = typeof data.category === "string" ? data.category : "";
  const subcategory =
    typeof data.subcategory === "string" ? data.subcategory : "";
  const date = typeof data.date === "string" ? data.date : "";

  if (!title || !excerpt || !date || !isCategorySlug(category)) {
    throw new Error(
      `Frontmatter inválido em ${slug}: title, excerpt, date e category (${CATEGORY_SLUGS.join("|")}) são obrigatórios.`,
    );
  }

  const resolvedSubcategory = subcategory
    ? getSubcategory(category, subcategory)
    : undefined;

  if (subcategory && !resolvedSubcategory) {
    throw new Error(
      `Frontmatter inválido em ${slug}: subcategory deve pertencer a ${category} (${SUBCATEGORY_SLUGS.join("|")}).`,
    );
  }

  const cover = typeof data.cover === "string" ? data.cover.trim() : "";
  const coverAlt = typeof data.coverAlt === "string" ? data.coverAlt.trim() : "";
  const coverCredit =
    typeof data.coverCredit === "string" ? data.coverCredit.trim() : "";

  return {
    title,
    seoTitle,
    excerpt,
    category,
    subcategory: resolvedSubcategory?.slug,
    date,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    author: typeof data.author === "string" ? data.author : undefined,
    featured: Boolean(data.featured),
    featuredPriority:
      typeof data.featuredPriority === "number" &&
      Number.isFinite(data.featuredPriority)
        ? data.featuredPriority
        : undefined,
    draft: Boolean(data.draft),
    kicker: typeof data.kicker === "string" ? data.kicker : undefined,
    cover: cover || undefined,
    coverAlt: coverAlt || undefined,
    coverCredit: coverCredit || undefined,
    format: parsePostFormat(data.format, slug),
  };
}

function toPost(slug: string, raw: string): Post | null {
  const { data, content } = matter(raw);
  const frontmatter = parseFrontmatter(data as Record<string, unknown>, slug);

  if (frontmatter.draft && process.env.NODE_ENV === "production") {
    return null;
  }

  const category = getCategory(frontmatter.category);
  if (!category) return null;
  const subcategory = frontmatter.subcategory
    ? getSubcategory(frontmatter.category, frontmatter.subcategory)
    : undefined;

  const updated = frontmatter.updated ?? frontmatter.date;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    ...frontmatter,
    slug,
    content: content.trim(),
    readingMinutes: readingTimeMinutes(content),
    wordCount,
    href: `/noticia/${slug}`,
    categoryLabel: category.label,
    subcategoryLabel: subcategory?.label,
    subcategoryHref: subcategory?.href,
    author: frontmatter.author ?? site.defaultAuthor,
    dateIso: toIsoDate(frontmatter.date),
    updatedIso: toIsoDate(updated),
  };
}

function readAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      return toPost(slug, raw);
    })
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) =>
        b.dateIso.localeCompare(a.dateIso) || a.slug.localeCompare(b.slug),
    );

  return posts;
}

export function getAllPosts(): Post[] {
  return readAllPosts();
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getNewsPosts(): Post[] {
  return getAllPosts().filter(isNewsFormat);
}

export function getPostsByFormat(format: PostFormat): Post[] {
  return getAllPosts().filter((post) => (post.format ?? "noticia") === format);
}

/** Evergreen formats (`review`, `guia`, `comparativo`), newest first. */
export function getReviewPosts(limit?: number): Post[] {
  const posts = getAllPosts().filter(isEvergreenFormat);
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsBySubcategory(
  category: CategorySlug,
  subcategory: SubcategorySlug,
): Post[] {
  return getAllPosts().filter(
    (post) =>
      post.category === category && post.subcategory === subcategory,
  );
}

export function getActiveSubcategories(
  category?: CategorySlug,
): Subcategory[] {
  const active = new Set(
    getAllPosts()
      .filter((post) => post.subcategory)
      .map((post) => `${post.category}/${post.subcategory}`),
  );

  return subcategoryList.filter(
    (subcategory) =>
      (!category || subcategory.parent === category) &&
      active.has(`${subcategory.parent}/${subcategory.slug}`),
  );
}

export function getFeaturedPost(posts = getNewsPosts()): Post | undefined {
  const featured = posts
    .filter((post) => post.featured)
    .sort(
      (a, b) =>
        (b.featuredPriority ?? 0) - (a.featuredPriority ?? 0) ||
        b.dateIso.localeCompare(a.dateIso) ||
        a.slug.localeCompare(b.slug),
    );
  return featured[0] ?? posts[0];
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const posts = getAllPosts();
  const sameSubcategory = post.subcategory
    ? posts.filter(
        (item) =>
          item.slug !== post.slug &&
          item.category === post.category &&
          item.subcategory === post.subcategory,
      )
    : [];
  const sameCategory = posts.filter(
    (item) =>
      item.slug !== post.slug &&
      item.category === post.category &&
      (!post.subcategory || item.subcategory !== post.subcategory),
  );
  const relevant = [...sameSubcategory, ...sameCategory];
  if (relevant.length >= limit) return relevant.slice(0, limit);

  const extras = posts.filter(
    (item) => item.slug !== post.slug && item.category !== post.category,
  );
  return [...relevant, ...extras].slice(0, limit);
}

export function getAdjacentPosts(post: Post) {
  const posts = getAllPosts();
  const index = posts.findIndex((item) => item.slug === post.slug);
  if (index < 0) return { newer: undefined, older: undefined };
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function latestUpdatedDate(
  posts: { updatedIso: string }[],
): Date | undefined {
  let latest = 0;
  for (const post of posts) {
    const time = new Date(post.updatedIso).getTime();
    if (time > latest) latest = time;
  }
  return latest ? new Date(latest) : undefined;
}

export function getLatestModifiedDate() {
  return latestUpdatedDate(getAllPosts()) ?? new Date();
}

export function searchPosts(query: string): Post[] {
  const q = query.trim().toLocaleLowerCase("pt-BR");
  if (!q) return [];

  return getAllPosts().filter((post) => {
    const haystack = [
      post.title,
      post.seoTitle ?? "",
      post.excerpt,
      post.kicker ?? "",
      post.categoryLabel,
      post.subcategoryLabel ?? "",
      post.content,
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return haystack.includes(q);
  });
}

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CATEGORY_SLUGS,
  getCategory,
  isCategorySlug,
  type CategorySlug,
} from "@/lib/categories";
import { readingTimeMinutes, toIsoDate } from "@/lib/format";
import { site } from "@/lib/site";

export type PostFrontmatter = {
  title: string;
  excerpt: string;
  category: CategorySlug;
  date: string;
  updated?: string;
  author?: string;
  featured?: boolean;
  draft?: boolean;
  kicker?: string;
  cover?: string;
  coverCredit?: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingMinutes: number;
  wordCount: number;
  href: string;
  categoryLabel: string;
  author: string;
  dateIso: string;
  updatedIso: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function parseFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const title = typeof data.title === "string" ? data.title : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
  const category = typeof data.category === "string" ? data.category : "";
  const date = typeof data.date === "string" ? data.date : "";

  if (!title || !excerpt || !date || !isCategorySlug(category)) {
    throw new Error(
      `Frontmatter inválido em ${slug}: title, excerpt, date e category (${CATEGORY_SLUGS.join("|")}) são obrigatórios.`,
    );
  }

  const cover = typeof data.cover === "string" ? data.cover.trim() : "";
  const coverCredit =
    typeof data.coverCredit === "string" ? data.coverCredit.trim() : "";

  return {
    title,
    excerpt,
    category,
    date,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    author: typeof data.author === "string" ? data.author : undefined,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    kicker: typeof data.kicker === "string" ? data.kicker : undefined,
    cover: cover || undefined,
    coverCredit: coverCredit || undefined,
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
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return posts;
}

export function getAllPosts(): Post[] {
  return readAllPosts();
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getFeaturedPost(): Post | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const posts = getAllPosts();
  const sameCategory = posts.filter(
    (item) => item.slug !== post.slug && item.category === post.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const extras = posts.filter(
    (item) => item.slug !== post.slug && item.category !== post.category,
  );
  return [...sameCategory, ...extras].slice(0, limit);
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

export function getLatestModifiedDate() {
  const posts = getAllPosts();
  let latest = 0;
  for (const post of posts) {
    const time = new Date(post.updatedIso).getTime();
    if (time > latest) latest = time;
  }
  return latest ? new Date(latest) : new Date();
}

export function searchPosts(query: string): Post[] {
  const q = query.trim().toLocaleLowerCase("pt-BR");
  if (!q) return [];

  return getAllPosts().filter((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      post.kicker ?? "",
      post.categoryLabel,
      post.content,
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return haystack.includes(q);
  });
}

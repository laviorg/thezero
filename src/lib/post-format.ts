export const POST_FORMATS = [
  "noticia",
  "review",
  "guia",
  "comparativo",
  "vale-a-pena",
  "tutorial",
] as const;

export type PostFormat = (typeof POST_FORMATS)[number];

/**
 * Evergreen stays off the home lead, Últimas, news RSS and the Google News
 * sitemap. `vale-a-pena` and `tutorial` are evergreen too, but they have
 * their own hubs — they do not join `/reviews`.
 */
export const EVERGREEN_FORMATS = [
  "review",
  "guia",
  "comparativo",
  "vale-a-pena",
  "tutorial",
] as const;

export type EvergreenFormat = (typeof EVERGREEN_FORMATS)[number];

/** Formats that live on `/reviews` and in the product-line buckets. */
export const REVIEW_ARCHIVE_FORMATS = ["review", "guia", "comparativo"] as const;

export type ReviewArchiveFormat = (typeof REVIEW_ARCHIVE_FORMATS)[number];

export function parsePostFormat(value: unknown, slug: string): PostFormat {
  if (value == null || value === "") return "noticia";
  if (
    typeof value === "string" &&
    (POST_FORMATS as readonly string[]).includes(value)
  ) {
    return value as PostFormat;
  }
  throw new Error(
    `Frontmatter inválido em ${slug}: format deve ser ${POST_FORMATS.join("|")}.`,
  );
}

export function isNewsFormat(post: { format?: string }): boolean {
  return (post.format ?? "noticia") === "noticia";
}

export function isEvergreenFormat(post: { format?: string }): boolean {
  const format = post.format ?? "";
  return (EVERGREEN_FORMATS as readonly string[]).includes(format);
}

export function isReviewArchiveFormat(post: { format?: string }): boolean {
  const format = post.format ?? "";
  return (REVIEW_ARCHIVE_FORMATS as readonly string[]).includes(format);
}

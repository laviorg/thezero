export const POST_FORMATS = [
  "noticia",
  "review",
  "guia",
  "comparativo",
] as const;

export type PostFormat = (typeof POST_FORMATS)[number];

export const EVERGREEN_FORMATS = ["review", "guia", "comparativo"] as const;

export type EvergreenFormat = (typeof EVERGREEN_FORMATS)[number];

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
  return (
    post.format === "review" ||
    post.format === "guia" ||
    post.format === "comparativo"
  );
}

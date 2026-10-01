export type SearchablePost = {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  excerpt: string;
  kicker?: string;
  categoryLabel: string;
  subcategoryLabel?: string;
  content: string;
};

/** Same haystack as the server search. Empty queries never match. */
export function postMatchesQuery(post: SearchablePost, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("pt-BR");
  if (!q) return false;

  const haystack = [
    post.title,
    post.seoTitle ?? "",
    post.seoDescription ?? "",
    post.excerpt,
    post.kicker ?? "",
    post.categoryLabel,
    post.subcategoryLabel ?? "",
    post.content,
  ]
    .join(" ")
    .toLocaleLowerCase("pt-BR");

  return haystack.includes(q);
}

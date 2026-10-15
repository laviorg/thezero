import { formatShortDate } from "@/lib/format";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/utils";

/**
 * Metadados de card: "Autor · Categoria · Data · X min".
 * Sem link interno: o card inteiro já é um link.
 */
export function NewsMeta({
  post,
  className,
}: {
  post: Post;
  className?: string;
  /** @deprecated o autor agora aparece em todos os cards */
  showAuthor?: boolean;
}) {
  const parts = [
    post.author,
    post.subcategoryLabel ?? post.categoryLabel,
    formatShortDate(post.date),
    `${post.readingMinutes} min`,
  ].filter(Boolean);

  return (
    <p className={cn("news-meta text-[0.72rem] leading-5 text-muted", className)}>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? (
            <span className="mx-2 text-hairline" aria-hidden>
              ·
            </span>
          ) : null}
          {index === 2 ? <time dateTime={post.dateIso}>{part}</time> : part}
        </span>
      ))}
    </p>
  );
}

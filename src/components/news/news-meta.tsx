import { resolveAuthor } from "@/lib/authors";
import { formatShortDate } from "@/lib/format";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NewsMeta({
  post,
  className,
  showAuthor = false,
}: {
  post: Post;
  className?: string;
  showAuthor?: boolean;
}) {
  const profile = resolveAuthor(post.authorSlug) ?? resolveAuthor(post.author);

  return (
    <p
      className={cn(
        "text-[0.67rem] tracking-[0.14em] text-muted uppercase",
        className,
      )}
    >
      {showAuthor ? (
        <>
          {profile ? (
            <Link
              href={profile.href}
              className="text-fg/85 normal-case tracking-normal hover:text-accent"
            >
              {post.author}
            </Link>
          ) : (
            <span className="text-fg/85 normal-case tracking-normal">
              {post.author}
            </span>
          )}
          <span className="mx-1.5 text-hairline" aria-hidden>
            /
          </span>
        </>
      ) : null}
      {post.subcategoryLabel ?? post.categoryLabel}
      <span className="mx-1.5 text-hairline" aria-hidden>
        /
      </span>
      <time dateTime={post.dateIso}>{formatShortDate(post.date)}</time>
      <span className="mx-1.5 text-hairline" aria-hidden>
        /
      </span>
      {post.readingMinutes} min
    </p>
  );
}

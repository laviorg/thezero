import { CoverImage } from "@/components/news/cover-image";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ArticleCardProps = {
  post: Post;
  className?: string;
  priority?: "lead" | "standard" | "compact";
};

export function ArticleCard({
  post,
  className,
  priority = "standard",
}: ArticleCardProps) {
  const isLead = priority === "lead";
  const isCompact = priority === "compact";

  const coverSizes = isLead
    ? "(min-width: 1152px) 1152px, 100vw"
    : isCompact
      ? "(min-width: 1024px) 20rem, 100vw"
      : "(min-width: 768px) 50vw, 100vw";

  return (
    <article className={cn("group", className)}>
      <Link href={post.href} className="flex h-full flex-col outline-none">
        {post.cover ? (
          <CoverImage
            src={post.cover}
            alt={post.title}
            crop
            priority={isLead}
            sizes={coverSizes}
            className={cn("mb-4", isLead && "mb-6", isCompact && "mb-3")}
          />
        ) : null}
        <p className="text-[0.7rem] font-medium tracking-[0.22em] text-accent uppercase">
          {post.kicker ?? post.categoryLabel}
        </p>
        <h2
          className={cn(
            "mt-3 font-semibold tracking-tight text-fg text-balance transition-colors group-hover:text-accent group-focus-visible:text-accent",
            isLead &&
              "text-[clamp(2.4rem,8vw,5.6rem)] leading-[0.92]",
            !isLead &&
              !isCompact &&
              "text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.08]",
            isCompact && "text-lg leading-snug",
          )}
        >
          {post.title}
        </h2>
        {!isCompact && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-muted text-pretty",
              isLead ? "text-lg sm:text-xl" : "text-sm sm:text-base",
            )}
          >
            {post.excerpt}
          </p>
        )}
        <p className="mt-4 text-xs tracking-wide text-muted uppercase">
          {post.categoryLabel}
          <span className="mx-2 text-white/20">/</span>
          {post.readingMinutes} min
        </p>
      </Link>
    </article>
  );
}

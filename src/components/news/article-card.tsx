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

  return (
    <article className={cn("group", className)}>
      <Link href={post.href} className="flex h-full flex-col outline-none">
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

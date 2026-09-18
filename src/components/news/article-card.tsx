import { SplitOMark } from "@/components/brand/logo";
import { CoverImage } from "@/components/news/cover-image";
import { NewsMeta } from "@/components/news/news-meta";
import type { Post } from "@/lib/posts";
import { coverAlt } from "@/lib/seo";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type ArticleCardLayout =
  | "lead"
  | "pack"
  | "standard"
  | "rail"
  | "stream"
  | "compact";

type ArticleCardProps = {
  post: Post;
  className?: string;
  /** @deprecated use `layout` — kept so existing call sites keep working */
  priority?: ArticleCardLayout;
  layout?: ArticleCardLayout;
  headingLevel?: "h1" | "h2" | "h3";
};

/**
 * Card sizing reacts to the card's own container, not the viewport, so a card
 * dropped into a narrow rail never squeezes its headline into a thin strip.
 */
const coverSizes: Record<ArticleCardLayout, string> = {
  lead: "(min-width: 1280px) 50rem, (min-width: 1024px) 62vw, 100vw",
  pack: "(min-width: 1280px) 24rem, (min-width: 640px) 45vw, 100vw",
  standard: "(min-width: 1280px) 24rem, (min-width: 640px) 45vw, 100vw",
  rail: "(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 100vw",
  stream: "(min-width: 640px) 8rem, 6rem",
  compact: "(min-width: 640px) 8rem, 6rem",
};

function Kicker({ children }: { children: string }) {
  return <p className="eyebrow page-kicker">{children}</p>;
}

export function ArticleCard({
  post,
  className,
  priority,
  layout,
  headingLevel,
}: ArticleCardProps) {
  const variant = layout ?? priority ?? "standard";
  const isLead = variant === "lead";
  const isStream = variant === "stream";
  const isCompact = variant === "compact";
  const isRow = isStream || isCompact;

  const Heading = headingLevel ?? (isLead ? "h1" : isCompact ? "h3" : "h2");
  const kicker = post.kicker ?? post.categoryLabel;
  const imageAlt = coverAlt(post.title, post.coverAlt);

  const linkTitle =
    "font-semibold tracking-tight text-fg text-pretty transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent";

  if (isRow) {
    return (
      <article
        data-layout={variant}
        className={cn(
          "article-card group @container border-b border-white/10 py-3.5 first:pt-0 last:border-b-0 last:pb-0",
          className,
        )}
      >
        <Link href={post.href} className="flex gap-3.5 outline-none">
          {isCompact ? null : post.cover ? (
            <CoverImage
              src={post.cover}
              alt={imageAlt}
              crop
              zoom
              watermarkSize="micro"
              sizes={coverSizes[variant]}
              className="hidden w-[5.25rem] shrink-0 @min-[17rem]:block @min-[26rem]:w-[7.5rem]"
            />
          ) : (
            /* Keeps the text edge aligned when a story has no cover. */
            <div
              aria-hidden
              className="hidden aspect-video w-[5.25rem] shrink-0 items-center justify-center rounded-md border border-white/5 bg-surface @min-[17rem]:flex @min-[26rem]:w-[7.5rem]"
            >
              <SplitOMark className="size-4 text-white/15" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Kicker>{kicker}</Kicker>
            <Heading
              className={cn(
                linkTitle,
                "mt-1 text-[0.97rem] leading-snug @min-[26rem]:text-[1.05rem]",
              )}
            >
              {post.title}
              <span className="card-arrow" aria-hidden>
                ↗
              </span>
            </Heading>
            <p className="mt-1 hidden text-[0.9rem] leading-5 text-muted text-pretty line-clamp-2 @min-[30rem]:block">
              {post.excerpt}
            </p>
            <NewsMeta post={post} className="mt-1.5" />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      data-layout={variant}
      className={cn("article-card group @container", className)}
    >
      <Link href={post.href} className="flex h-full flex-col outline-none">
        {post.cover ? (
          <CoverImage
            src={post.cover}
            alt={imageAlt}
            crop
            priority={isLead}
            watermarkSize={isLead ? "default" : "compact"}
            sizes={coverSizes[variant]}
            zoom
            className={cn("mb-3", isLead && "mb-4")}
          />
        ) : null}
        <Kicker>{kicker}</Kicker>
        <Heading
          className={cn(
            linkTitle,
            "mt-1.5",
            isLead
              ? "text-[clamp(1.6rem,1.1rem+1.85vw,2.35rem)] leading-[1.06]"
              : "text-[1.02rem] leading-snug @min-[18rem]:text-[1.09rem] @min-[25rem]:text-[1.18rem]",
          )}
        >
          {post.title}
          <span className="card-arrow" aria-hidden>
            ↗
          </span>
        </Heading>
        <p
          className={cn(
            "mt-2 text-muted text-pretty",
            isLead
              ? "max-w-[56ch] text-[0.98rem] leading-6 sm:text-[1.03rem] sm:leading-7"
              : "text-[0.9rem] leading-5 line-clamp-2",
          )}
        >
          {post.excerpt}
        </p>
        <NewsMeta
          post={post}
          showAuthor={isLead}
          className={cn(isLead ? "mt-3" : "mt-auto pt-2.5")}
        />
      </Link>
    </article>
  );
}

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

function Kicker({ children }: { children: string }) {
  return (
    <p className="text-[0.65rem] font-medium tracking-[0.18em] text-accent uppercase">
      {children}
    </p>
  );
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
  const isPack = variant === "pack";
  const isRail = variant === "rail";
  const isStream = variant === "stream";
  const isCompact = variant === "compact";

  const Heading = headingLevel ?? (isLead ? "h1" : isCompact ? "h3" : "h2");
  const kicker = post.kicker ?? post.categoryLabel;
  const imageAlt = coverAlt(post.title, post.coverCredit);

  const coverSizes = isLead
    ? "(min-width: 1152px) 44rem, (min-width: 768px) 60vw, 100vw"
    : isPack
      ? "(min-width: 1024px) 22rem, 100vw"
      : isStream || isCompact
        ? "(min-width: 1024px) 10rem, 30vw"
        : isRail
          ? "(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
          : "(min-width: 768px) 50vw, 100vw";

  const titleClass = cn(
    "font-semibold tracking-tight text-fg text-pretty transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent",
    isLead && "mt-2 text-[clamp(1.65rem,4vw,2.85rem)] leading-[1.08]",
    isPack && "mt-1.5 text-[1.05rem] leading-snug sm:text-lg",
    variant === "standard" &&
      "mt-2 text-[clamp(1.15rem,2vw,1.55rem)] leading-snug",
    isRail && "mt-2 text-base leading-snug sm:text-lg",
    isStream && "mt-1 text-[1.05rem] leading-snug sm:text-lg",
    isCompact && "mt-1.5 text-base leading-snug",
  );

  if (isPack) {
    return (
      <article
        className={cn(
          "group border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0",
          className,
        )}
      >
        <Link href={post.href} className="flex flex-col outline-none">
          {post.cover ? (
            <CoverImage
              src={post.cover}
              alt={imageAlt}
              crop
              zoom
              watermarkSize="compact"
              sizes={coverSizes}
              className="mb-2.5"
            />
          ) : null}
          <Kicker>{kicker}</Kicker>
          <Heading className={titleClass}>{post.title}</Heading>
          <NewsMeta post={post} className="mt-2" />
        </Link>
      </article>
    );
  }

  if (isStream) {
    return (
      <article
        className={cn(
          "group border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0",
          className,
        )}
      >
        <Link href={post.href} className="flex gap-4 outline-none">
          {post.cover ? (
            <CoverImage
              src={post.cover}
              alt={imageAlt}
              crop
              zoom
              watermarkSize="micro"
              sizes={coverSizes}
              className="w-28 shrink-0 sm:w-40"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <Kicker>{kicker}</Kicker>
            <Heading className={titleClass}>{post.title}</Heading>
            <p className="mt-1.5 hidden text-sm leading-5 text-muted text-pretty line-clamp-2 lg:block">
              {post.excerpt}
            </p>
            <NewsMeta post={post} className="mt-2" />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group", className)}>
      <Link href={post.href} className="flex h-full flex-col outline-none">
        {post.cover ? (
          <CoverImage
            src={post.cover}
            alt={imageAlt}
            crop
            priority={isLead}
            watermarkSize={isLead ? "default" : "compact"}
            sizes={coverSizes}
            zoom
            className={cn(
              "mb-3",
              isLead && "mb-4",
              isCompact && "mb-2.5",
            )}
          />
        ) : null}
        <Kicker>{kicker}</Kicker>
        <Heading className={titleClass}>{post.title}</Heading>
        {!isCompact && !isRail && (
          <p
            className={cn(
              "mt-2.5 text-muted text-pretty",
              isLead
                ? "max-w-2xl text-[1.05rem] leading-7 sm:text-lg sm:leading-8"
                : "text-sm leading-6 line-clamp-3",
            )}
          >
            {post.excerpt}
          </p>
        )}
        <NewsMeta
          post={post}
          showAuthor={isLead}
          className={cn("mt-3", isCompact && "mt-2")}
        />
      </Link>
    </article>
  );
}

import { ArticleCard } from "@/components/news/article-card";
import { SectionHeading } from "@/components/news/section-heading";
import type { Post } from "@/lib/posts";
import Link from "next/link";

const HOME_LIMIT = 6;

export function ReviewRail({ posts }: { posts: Post[] }) {
  const shown = posts.slice(0, HOME_LIMIT);
  if (shown.length === 0) return null;

  const single = shown.length === 1;

  return (
    <section
      className="my-8 rounded-lg border border-border border-t-4 border-t-accent bg-surface-raised px-4 py-6 [content-visibility:auto] [contain-intrinsic-size:auto_26rem] sm:px-6 lg:py-8 [background-image:repeating-linear-gradient(90deg,transparent_0_23px,color-mix(in_srgb,var(--tz-border)_35%,transparent)_23px_24px)]"
      aria-labelledby="secao-reviews"
    >
      <SectionHeading
        id="secao-reviews"
        eyebrow="Uso, não ficha"
        title="Reviews"
        href="/reviews"
        actionLabel="Ver reviews"
      />

      {single ? (
        <div className="mt-4 max-w-3xl">
          <ArticleCard post={shown[0]} layout="stream" headingLevel="h3" />
        </div>
      ) : (
        <div className="mt-5 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post) => (
            <ArticleCard
              key={post.slug}
              post={post}
              layout="rail"
              headingLevel="h3"
            />
          ))}
        </div>
      )}

      <Link
        href="/reviews"
        className="mt-5 inline-block text-[0.78rem] font-medium tracking-[0.12em] text-accent uppercase sm:hidden"
      >
        Ver reviews
      </Link>
    </section>
  );
}

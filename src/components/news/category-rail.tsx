import type { Category } from "@/lib/categories";
import type { Post } from "@/lib/posts";
import { ArticleCard } from "@/components/news/article-card";
import { SectionHeading } from "@/components/news/section-heading";
import Link from "next/link";

export function CategoryRail({
  category,
  posts,
}: {
  category: Category;
  posts: Post[];
}) {
  const shown = posts.slice(0, 4);
  /** A lone story reads better as a wide row than as one orphan column. */
  const single = shown.length === 1;

  return (
    <section
      className="border-t border-border py-7 [content-visibility:auto] [contain-intrinsic-size:auto_22rem] lg:py-8"
      aria-labelledby={`editoria-${category.slug}`}
    >
      <SectionHeading
        id={`editoria-${category.slug}`}
        eyebrow={category.kicker}
        title={category.label}
        href={category.href}
        actionLabel={`Ver ${category.label}`}
      />

      {shown.length === 0 ? (
        <p className="mt-5 max-w-xl text-sm text-muted">
          Ainda não tem matéria nesta editoria. Entra de novo amanhã.
        </p>
      ) : single ? (
        <div className="mt-4 max-w-3xl">
          <ArticleCard post={shown[0]} layout="stream" headingLevel="h3" />
        </div>
      ) : (
        <div className="mt-5 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        href={category.href}
        className="mt-5 inline-block text-[0.78rem] font-medium tracking-[0.12em] text-accent uppercase sm:hidden"
      >
        Ver {category.label}
      </Link>
    </section>
  );
}

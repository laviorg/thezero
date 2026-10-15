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
        actionLabel={`Ver tudo em ${category.label} →`}
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
        <div className="mt-5 grid gap-x-8 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ArticleCard post={shown[0]} layout="standard" headingLevel="h3" />
          </div>
          <div className="border-t border-border pt-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
            {shown.slice(1).map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                layout="dense"
                headingLevel="h3"
              />
            ))}
          </div>
        </div>
      )}

      <Link
        href={category.href}
        className="mt-5 flex w-full items-center justify-center rounded-md border border-border py-2.5 text-[0.78rem] font-medium tracking-[0.12em] text-accent uppercase transition-colors hover:bg-surface-raised sm:hidden"
      >
        Ver tudo em {category.label} →
      </Link>
    </section>
  );
}

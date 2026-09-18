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
  return (
    <section
      className="border-t border-white/10 py-7 [content-visibility:auto] [contain-intrinsic-size:auto_20rem] lg:py-8"
      aria-labelledby={`editoria-${category.slug}`}
    >
      <SectionHeading
        id={`editoria-${category.slug}`}
        eyebrow={category.kicker}
        title={category.label}
        href={category.href}
        actionLabel={`Ver ${category.label}`}
      />

      {posts.length === 0 ? (
        <p className="mt-5 max-w-xl text-sm text-muted">
          Ainda não tem matéria nesta editoria. Entra de novo amanhã.
        </p>
      ) : (
        <div
          className={
            posts.length === 1
              ? "mt-5 max-w-md"
              : "mt-5 grid gap-x-5 gap-y-6 sm:grid-cols-2 xl:grid-cols-4"
          }
        >
          {posts.slice(0, 4).map((post) => (
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
        className="mt-5 inline-block text-sm text-accent sm:hidden"
      >
        Ver {category.label}
      </Link>
    </section>
  );
}

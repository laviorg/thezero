import type { Category } from "@/lib/categories";
import type { Post } from "@/lib/posts";
import { ArticleCard } from "@/components/news/article-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CategoryRail({
  category,
  posts,
}: {
  category: Category;
  posts: Post[];
}) {
  if (posts.length === 0) {
    return (
      <section className="border-t border-white/10 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] text-accent uppercase">
              {category.kicker}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {category.label}
            </h2>
          </div>
        </div>
        <p className="mt-6 max-w-xl text-muted">
          Ainda não tem matéria nesta editoria. Entra de novo amanhã.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t border-white/10 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-[0.22em] text-accent uppercase">
            {category.kicker}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {category.label}
          </h2>
        </div>
        <Button variant="link" asChild className="hidden sm:inline-flex">
          <Link href={category.href}>Ver {category.label}</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {posts.slice(0, 2).map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
      <Button variant="link" asChild className="mt-6 sm:hidden">
        <Link href={category.href}>Ver {category.label}</Link>
      </Button>
    </section>
  );
}

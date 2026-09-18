import { ArticleCard } from "@/components/news/article-card";
import { CategoryRail } from "@/components/news/category-rail";
import { Button } from "@/components/ui/button";
import { categoryList } from "@/lib/categories";
import { getAllPosts, getFeaturedPost, getPostsByCategory } from "@/lib/posts";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const rest = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : posts;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-[0.7rem] font-medium tracking-[0.25em] text-accent uppercase">
        Newsroom · {site.tagline} · Brasil
      </p>

      {featured ? (
        <section className="mt-6 border-b border-white/10 pb-12">
          <ArticleCard post={featured} priority="lead" />
          <Button asChild className="mt-8" size="lg">
            <Link href={featured.href}>Ler a matéria</Link>
          </Button>
        </section>
      ) : (
        <section className="mt-10 max-w-2xl">
          <h1 className="text-[clamp(2.4rem,8vw,5rem)] font-semibold leading-[0.92] tracking-tight">
            O newsroom ainda está vazio.
          </h1>
          <p className="mt-6 text-lg text-muted">
            Coloca o primeiro MDX em <code className="text-accent">content/posts</code>.
          </p>
        </section>
      )}

      {rest.length > 0 && (
        <section className="grid gap-10 border-b border-white/10 py-12 md:grid-cols-3">
          {rest.slice(0, 3).map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </section>
      )}

      {categoryList.map((category) => (
        <CategoryRail
          key={category.slug}
          category={category}
          posts={getPostsByCategory(category.slug)}
        />
      ))}
    </div>
  );
}

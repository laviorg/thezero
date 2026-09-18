import { ArticleCard } from "@/components/news/article-card";
import { CategoryRail } from "@/components/news/category-rail";
import { ItemListJsonLd } from "@/components/news/json-ld";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { categoryList } from "@/lib/categories";
import { formatToday } from "@/lib/format";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPosts, getFeaturedPost, getPostsByCategory } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    path: "/",
    absoluteTitle: true,
    ogTitle: `${site.name} — ${site.tagline}`,
    imagePath: "/opengraph-image",
    imageAlt: `${site.name} — ${site.tagline}`,
  }),
  alternates: {
    canonical: "/",
    languages: { "pt-BR": "/" },
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function HomePage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const rest = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : posts;
  const pack = rest.slice(0, 3);
  const latest = rest.slice(3, 9);
  const listed = featured ? [featured, ...rest.slice(0, 8)] : rest.slice(0, 9);

  return (
    <PageShell>
      <ItemListJsonLd
        name={`Últimas no ${site.name}`}
        items={listed.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-[0.65rem] font-medium tracking-[0.22em] text-accent uppercase">
            Newsroom
          </p>
          <p className="mt-1 text-sm text-muted">
            {site.tagline} · Brasil
          </p>
        </div>
        <time className="text-[0.7rem] tracking-wide text-muted uppercase">
          {formatToday()}
        </time>
      </div>

      {featured ? (
        <section className="grid gap-8 border-b border-white/10 py-6 lg:grid-cols-12 lg:gap-10 lg:py-7">
          <div className="lg:col-span-7 xl:col-span-8">
            <ArticleCard post={featured} layout="lead" headingLevel="h1" />
          </div>
          {pack.length > 0 ? (
            <div className="flex flex-col lg:col-span-5 xl:col-span-4 lg:border-l lg:border-white/10 lg:pl-8">
              <p className="mb-3 text-[0.65rem] font-medium tracking-[0.2em] text-muted uppercase">
                Também nesta edição
              </p>
              {pack.map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  layout="pack"
                  headingLevel="h2"
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="max-w-2xl py-10">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-[0.95] tracking-tight">
            O newsroom ainda está vazio.
          </h1>
          <p className="mt-5 text-lg text-muted">
            Coloca o primeiro MDX em{" "}
            <code className="text-accent">content/posts</code>.
          </p>
        </section>
      )}

      {latest.length > 0 ? (
        <section className="border-b border-white/10 py-8">
          <SectionHeading title="Últimas" />
          <div className="mt-2">
            {latest.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                layout="stream"
                headingLevel="h2"
              />
            ))}
          </div>
        </section>
      ) : null}

      <nav
        aria-label="Ir para editorias"
        className="flex flex-wrap gap-2 border-b border-white/10 py-5"
      >
        {categoryList.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="border border-white/12 px-3 py-1.5 text-[0.8rem] tracking-wide text-muted uppercase transition-colors hover:border-accent hover:text-accent"
          >
            {category.label}
          </Link>
        ))}
      </nav>

      {categoryList.map((category) => (
        <CategoryRail
          key={category.slug}
          category={category}
          posts={getPostsByCategory(category.slug)}
        />
      ))}
    </PageShell>
  );
}

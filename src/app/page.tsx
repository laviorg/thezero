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
  const latest = rest.slice(3, 7);
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
          <p className="eyebrow page-kicker">Newsroom</p>
          <p className="mt-1 text-sm text-muted">
            {site.tagline} · Brasil
          </p>
        </div>
        <time className="text-[0.7rem] tracking-wide text-muted uppercase">
          {formatToday()}
        </time>
      </div>

      {featured ? (
        <section className="grid gap-6 border-b border-white/10 py-5 lg:grid-cols-12 lg:gap-6 xl:gap-8 xl:py-6">
          <div className="lg:col-span-6 xl:col-span-7">
            <ArticleCard post={featured} layout="lead" headingLevel="h1" />
          </div>
          {pack.length > 0 ? (
            <div className="flex flex-col lg:col-span-3 lg:border-l lg:border-white/10 lg:pl-5 xl:pl-6">
              <p className="mb-2 eyebrow text-muted">Também nesta edição</p>
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
          {latest.length > 0 ? (
            <div className="lg:col-span-3 lg:border-l lg:border-white/10 lg:pl-5 xl:col-span-2 xl:pl-6">
              <p className="mb-2 eyebrow text-muted">Últimas</p>
              {latest.map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  layout="stream"
                  headingLevel="h2"
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="max-w-2xl py-8 sm:py-10">
          <h1 className="page-title font-semibold text-balance">
            O newsroom ainda está vazio.
          </h1>
          <p className="mt-4 lede">
            Coloca o primeiro MDX em{" "}
            <code className="text-accent">content/posts</code>.
          </p>
        </section>
      )}

      <nav
        aria-label="Ir para editorias"
        className="flex flex-wrap gap-2 border-b border-white/10 py-4"
      >
        {categoryList.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="chip-link"
          >
            {category.label}
          </Link>
        ))}
      </nav>

      {!featured && latest.length > 0 ? (
        <section className="border-b border-white/10 py-7">
          <SectionHeading title="Últimas" />
          <div className="mt-2 grid gap-x-5 gap-y-0 lg:grid-cols-2">
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

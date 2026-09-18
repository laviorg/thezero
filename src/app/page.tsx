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
    languages: { "pt-BR": "/", "x-default": "/" },
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
  const rail = rest.slice(0, 4);
  const latest = rest.slice(4, 10);
  const listed = featured ? [featured, ...rest.slice(0, 8)] : rest.slice(0, 9);
  const categoryRails = categoryList
    .map((category) => ({
      category,
      posts: getPostsByCategory(category.slug),
    }))
    .filter(({ posts: categoryPosts }) => categoryPosts.length > 0);

  return (
    <PageShell>
      <ItemListJsonLd
        name={`Últimas no ${site.name}`}
        items={listed.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <div className="newsroom-masthead flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="eyebrow page-kicker">Newsroom</p>
          <p className="mt-1 text-sm text-muted">
            {site.tagline} · Brasil
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-[0.7rem] tracking-wide text-muted uppercase">
          <span>{posts.length} matérias</span>
          <span className="text-white/20" aria-hidden>
            /
          </span>
          <time>{formatToday()}</time>
        </div>
      </div>

      {featured ? (
        <section className="newsroom-lead grid gap-7 border-b border-white/10 py-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="lg:col-span-8">
            <ArticleCard post={featured} layout="lead" headingLevel="h1" />
          </div>
          {rail.length > 0 ? (
            <div className="flex flex-col border-t border-white/10 pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
              <p className="eyebrow mb-2 text-muted">Também nesta edição</p>
              <div>
                {rail.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="stream"
                    headingLevel="h2"
                  />
                ))}
              </div>
              <Link
                href="/busca"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.78rem] font-medium tracking-[0.12em] text-accent uppercase transition-colors hover:text-fg"
              >
                Ver todo o newsroom
                <span aria-hidden>→</span>
              </Link>
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

      {latest.length > 0 ? (
        <section className="border-b border-white/10 py-7">
          <SectionHeading
            title="Últimas"
            href="/busca"
            actionLabel="Ver tudo"
          />
          <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {latest.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                layout="standard"
                headingLevel="h2"
              />
            ))}
          </div>
        </section>
      ) : null}

      <nav
        aria-label="Ir para editorias"
        className="flex flex-wrap gap-2 border-b border-white/10 py-4"
      >
        {categoryList.map((category) => (
          <Link key={category.slug} href={category.href} className="chip-link">
            {category.label}
          </Link>
        ))}
      </nav>

      {categoryRails.map(({ category, posts: categoryPosts }) => (
        <CategoryRail
          key={category.slug}
          category={category}
          posts={categoryPosts}
        />
      ))}
    </PageShell>
  );
}

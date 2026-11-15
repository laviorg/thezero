import { ArticleCard } from "@/components/news/article-card";
import { CategoryRail } from "@/components/news/category-rail";
import { HomePageJsonLd, ItemListJsonLd } from "@/components/news/json-ld";
import { ReviewRail } from "@/components/news/review-rail";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { categoryList } from "@/lib/categories";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getFeaturedPost,
  getNewsPosts,
  getPostsByCategory,
  getReviewPosts,
  isNewsFormat,
} from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import { HOME_H1, HOME_TITLE, homePageTitle } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Static HTML from the MDX shipped in this deploy. `/` has no `revalidate`,
 * so a post merged to main is the hero on the next build. Posts are read
 * from disk at build time, not through a data cache that could outlive the deploy.
 */
export const dynamic = "force-static";

const homeMetadata = buildPageMetadata({
  title: HOME_TITLE,
  description: site.description,
  path: "/",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: homePageTitle(),
});

// Next rewrites a root canonical and og:url to the bare origin (no slash).
// The served URL is `https://www.thezero.com.br/`, so those two tags are
// written below instead of through the Metadata API.
const { url: _homeOgUrl, ...homeOpenGraph } = homeMetadata.openGraph ?? {};

export const metadata: Metadata = {
  ...homeMetadata,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: homeOpenGraph,
};

export default function HomePage() {
  const posts = getNewsPosts();
  const featured = getFeaturedPost(posts);
  const reviews = getReviewPosts(6);
  const rest = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : posts;
  /**
   * A text-only lead beside a tall stream leaves a dead column. Keep the rail
   * next to a cover so container-query cards fill the banner height.
   */
  const useRail = Boolean(featured?.cover) && rest.length > 0;
  const rail = useRail ? rest.slice(0, 6) : [];
  const latest = useRail ? rest.slice(6, 12) : rest.slice(0, 6);
  const listed = featured ? [featured, ...rest.slice(0, 8)] : rest.slice(0, 9);
  const categoryRails = categoryList
    .map((category) => ({
      category,
      posts: getPostsByCategory(category.slug).filter(isNewsFormat),
    }))
    .filter(({ posts: categoryPosts }) => categoryPosts.length > 0);

  return (
    <PageShell>
      <link rel="canonical" href={absoluteUrl("/")} />
      <link rel="alternate" hrefLang="pt-BR" href={absoluteUrl("/")} />
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl("/")} />
      <meta property="og:url" content={absoluteUrl("/")} />
      <HomePageJsonLd />
      <ItemListJsonLd
        name={`Últimas no ${site.name}`}
        items={listed.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      {/* Brand H1 stays in the DOM for SEO; visually hidden so the home starts with the featured story. */}
      <h1 className="sr-only">{HOME_H1}</h1>

      {featured ? (
        useRail ? (
          <section className="newsroom-lead grid gap-7 border-b border-border pb-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <div className="lg:col-span-8">
              <ArticleCard post={featured} layout="lead" headingLevel="h2" />
            </div>
            <div className="flex flex-col border-t border-border pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
              <p className="eyebrow mb-2 text-muted">Também nesta edição</p>
              <div>
                {rail.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="dense"
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
          </section>
        ) : (
          <section className="max-w-4xl border-b border-border pb-8">
            <ArticleCard post={featured} layout="lead" headingLevel="h2" />
          </section>
        )
      ) : (
        <section className="max-w-2xl py-8 sm:py-10">
          <h2 className="page-title font-extrabold text-balance">
            O newsroom ainda está vazio.
          </h2>
          <p className="lede mt-4">
            Coloca o primeiro MDX em{" "}
            <code className="text-accent">content/posts</code>.
          </p>
        </section>
      )}

      <section aria-label="Ofertas" className="border-b border-border py-5">
        <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">Ofertas</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/menor-preco" className="font-medium hover:text-accent">
            Menor preço do dia: placas de vídeo, SSDs e consoles checados na KaBuM →
          </Link>
          <Link href="/black-friday" className="font-medium hover:text-accent">
            Black Friday 2026: o que vale comprar →
          </Link>
        </div>
      </section>

      {latest.length > 0 ? (
        <section className="border-b border-border py-7">
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
        className="flex flex-wrap gap-2 border-b border-border py-4"
      >
        {categoryList.map((category) => (
          <Link key={category.slug} href={category.href} className="chip-link">
            {category.label}
          </Link>
        ))}
      </nav>

      {reviews.length > 0 ? <ReviewRail posts={reviews} /> : null}

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

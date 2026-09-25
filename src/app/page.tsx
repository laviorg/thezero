import { ArticleCard } from "@/components/news/article-card";
import { CategoryRail } from "@/components/news/category-rail";
import { ItemListJsonLd } from "@/components/news/json-ld";
import { ReviewRail } from "@/components/news/review-rail";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { categoryList } from "@/lib/categories";
import { formatToday } from "@/lib/format";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getFeaturedPost,
  getNewsPosts,
  getPostsByCategory,
  getReviewPosts,
  isNewsFormat,
} from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import { HOME_TITLE, homePageTitle } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: HOME_TITLE,
    description: site.description,
    path: "/",
    brand: "never",
    imagePath: "/opengraph-image",
    imageAlt: homePageTitle(),
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
  const rail = useRail ? rest.slice(0, 4) : [];
  const latest = useRail ? rest.slice(4, 10) : rest.slice(0, 6);
  const listed = featured ? [featured, ...rest.slice(0, 8)] : rest.slice(0, 9);
  const categoryRails = categoryList
    .map((category) => ({
      category,
      posts: getPostsByCategory(category.slug).filter(isNewsFormat),
    }))
    .filter(({ posts: categoryPosts }) => categoryPosts.length > 0);
  const shownOnHome = new Set<string>([
    ...(featured ? [featured.slug] : []),
    ...rail.map((post) => post.slug),
    ...latest.map((post) => post.slug),
    ...categoryRails.flatMap(({ posts: categoryPosts }) =>
      categoryPosts.slice(0, 4).map((post) => post.slug),
    ),
  ]);
  const alsoInArchive = posts.filter((post) => !shownOnHome.has(post.slug));

  return (
    <PageShell>
      <ItemListJsonLd
        name={`Últimas no ${site.name}`}
        items={listed.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <div className="newsroom-masthead flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="eyebrow page-kicker">Newsroom</p>
          <p className="mt-1 text-sm text-muted">Brasil</p>
        </div>
        <time className="text-[0.7rem] tracking-wide text-muted uppercase">
          {formatToday()}
        </time>
      </div>

      {featured ? (
        useRail ? (
          <section className="newsroom-lead mt-6 grid gap-7 border-b border-border pb-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <div className="lg:col-span-8">
              <ArticleCard post={featured} layout="lead" headingLevel="h1" />
            </div>
            <div className="flex flex-col border-t border-border pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
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
          </section>
        ) : (
          <section className="mt-6 max-w-4xl border-b border-border pb-8">
            <ArticleCard post={featured} layout="lead" headingLevel="h1" />
          </section>
        )
      ) : (
        <section className="max-w-2xl py-8 sm:py-10">
          <h1 className="page-title font-extrabold text-balance">
            O newsroom ainda está vazio.
          </h1>
          <p className="lede mt-4">
            Coloca o primeiro MDX em{" "}
            <code className="text-accent">content/posts</code>.
          </p>
        </section>
      )}

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

      {alsoInArchive.length > 0 ? (
        <nav
          aria-label="Mais matérias no arquivo"
          className="border-t border-border py-7"
        >
          <SectionHeading title="Também no arquivo" as="h2" />
          <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {alsoInArchive.map((post) => (
              <li key={post.slug}>
                <Link
                  href={post.href}
                  className="text-sm leading-snug text-fg/90 transition-colors hover:text-accent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </PageShell>
  );
}

import { ArticleBody } from "@/components/news/article-body";
import { ArticleCard } from "@/components/news/article-card";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { CoverImage } from "@/components/news/cover-image";
import {
  BreadcrumbJsonLd,
  NewsArticleJsonLd,
} from "@/components/news/json-ld";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { categoryList, getCategory, getSubcategory } from "@/lib/categories";
import { formatDate, readingTimeLabel } from "@/lib/format";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import {
  articleOgImagePath,
  coverAlt,
  newsRobots,
} from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const subcategory = post.subcategory
    ? getSubcategory(post.category, post.subcategory)
    : undefined;

  const url = absoluteUrl(post.href);
  const ogPath = articleOgImagePath(post.slug);
  const base = buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: post.href,
    type: "article",
    imagePath: ogPath,
    imageAlt: post.title,
  });

  return {
    ...base,
    authors: [{ name: post.author, url: absoluteUrl("/sobre") }],
    category: post.categoryLabel,
    keywords: [
      post.categoryLabel,
      subcategory?.label,
      post.kicker,
      "The Zero",
    ].filter((value): value is string => Boolean(value)),
    robots: newsRobots,
    openGraph: {
      ...base.openGraph,
      type: "article",
      url,
      publishedTime: post.dateIso,
      modifiedTime: post.updatedIso,
      authors: [absoluteUrl("/sobre")],
      section: post.categoryLabel,
      tags: [post.categoryLabel, subcategory?.label].filter(
        (value): value is string => Boolean(value),
      ),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategory(post.category);
  const subcategory = post.subcategory
    ? getSubcategory(post.category, post.subcategory)
    : undefined;
  const related = getRelatedPosts(post);
  const { newer, older } = getAdjacentPosts(post);
  const pageUrl = absoluteUrl(post.href);

  return (
    <article>
      <div className="reading-progress" aria-hidden>
        <span />
      </div>
      <NewsArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        datePublished={post.dateIso}
        dateModified={post.updatedIso}
        url={pageUrl}
        section={post.categoryLabel}
        author={post.author}
        image={absoluteUrl(articleOgImagePath(post.slug))}
        wordCount={post.wordCount}
        readingMinutes={post.readingMinutes}
        keywords={[
          post.categoryLabel,
          ...(post.subcategoryLabel ? [post.subcategoryLabel] : []),
          ...(post.kicker ? [post.kicker] : []),
          "tecnologia",
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: site.name, url: site.url },
          ...(category
            ? [{ name: category.label, url: absoluteUrl(category.href) }]
            : []),
          ...(subcategory
            ? [
                {
                  name: subcategory.label,
                  url: absoluteUrl(subcategory.href),
                },
              ]
            : []),
          { name: post.title, url: pageUrl },
        ]}
      />
      <PageShell width="article">
        {/* Story column and rail share one grid so the rail fills the top of the
            page instead of leaving the right half empty beside the headline. */}
        <div className="grid gap-9 lg:grid-cols-[minmax(0,44rem)_minmax(16rem,1fr)] lg:items-start lg:gap-12 xl:gap-14">
          <div className="min-w-0">
            <header className="border-l border-l-accent/40 pl-4 sm:pl-5">
              {category ? (
                <Breadcrumbs
                  items={[
                    { href: "/", label: "Newsroom" },
                    { href: category.href, label: category.label },
                    ...(subcategory
                      ? [
                          {
                            href: subcategory.href,
                            label: subcategory.label,
                          },
                        ]
                      : []),
                    { label: post.title },
                  ]}
                />
              ) : null}
              {category && (
                <Link
                  href={subcategory?.href ?? category.href}
                  className="eyebrow page-kicker"
                >
                  {post.kicker ?? subcategory?.label ?? category.label}
                </Link>
              )}
              <h1 className="story-title mt-2.5 font-semibold text-balance">
                {post.title}
              </h1>
              <p className="lede mt-3.5 text-pretty">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-white/10 py-3 text-sm text-muted">
                <span className="font-medium text-fg">{post.author}</span>
                <span className="text-white/20" aria-hidden>
                  ·
                </span>
                <time dateTime={post.dateIso}>{formatDate(post.date)}</time>
                {post.updated && post.updated !== post.date ? (
                  <>
                    <span className="text-white/20" aria-hidden>
                      ·
                    </span>
                    <span>
                      Atualizado em{" "}
                      <time dateTime={post.updatedIso}>
                        {formatDate(post.updated)}
                      </time>
                    </span>
                  </>
                ) : null}
                <span className="text-white/20" aria-hidden>
                  ·
                </span>
                <span>{readingTimeLabel(post.readingMinutes)}</span>
                {category ? (
                  <>
                    <span className="text-white/20" aria-hidden>
                      ·
                    </span>
                    <Link
                      href={subcategory?.href ?? category.href}
                      className="hover:text-accent"
                    >
                      {subcategory?.label ?? category.label}
                    </Link>
                  </>
                ) : null}
              </div>
            </header>

            {post.cover ? (
              <CoverImage
                src={post.cover}
                alt={coverAlt(post.title, post.coverAlt)}
                credit={post.coverCredit}
                priority
                flush
                crop
                watermarkSize="default"
                sizes="(min-width: 1280px) 44rem, (min-width: 1024px) 58vw, 100vw"
                className="mt-5 -mx-[var(--shell-gutter)] sm:mx-0 sm:mt-6"
              />
            ) : null}

            <div className="mt-7 border-t border-white/10 pt-7">
              <ArticleBody source={post.content} />
            </div>

            {(newer || older) && (
              <nav
                aria-label="Matérias vizinhas"
                className="mt-10 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-2"
              >
                {older ? (
                  <Link href={older.href} className="group block">
                    <p className="eyebrow text-muted">Mais antiga</p>
                    <p className="mt-2 font-semibold tracking-tight group-hover:text-accent">
                      <span aria-hidden>← </span>
                      {older.title}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
                {newer ? (
                  <Link href={newer.href} className="group block sm:text-right">
                    <p className="eyebrow text-muted">Mais recente</p>
                    <p className="mt-2 font-semibold tracking-tight group-hover:text-accent">
                      {newer.title}
                      <span aria-hidden> →</span>
                    </p>
                  </Link>
                ) : null}
              </nav>
            )}
          </div>

          <aside
            className="article-aside p-4 sm:p-5 lg:sticky lg:top-24"
            aria-labelledby="mais-nesta-casa"
          >
            <SectionHeading
              title="Mais nesta casa"
              as="h2"
              id="mais-nesta-casa"
            />
            <div className="mt-1">
              {related.map((item) => (
                <ArticleCard
                  key={item.slug}
                  post={item}
                  layout="stream"
                  headingLevel="h3"
                />
              ))}
            </div>
            <p className="eyebrow mt-7 text-muted">Editorias</p>
            <nav aria-label="Editorias" className="mt-3 flex flex-wrap gap-2">
              {categoryList.map((item) => (
                <Link key={item.slug} href={item.href} className="chip-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </PageShell>
    </article>
  );
}

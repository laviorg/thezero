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
import { getCategory } from "@/lib/categories";
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
  assetUrl,
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
    authors: [{ name: post.author, url: site.url }],
    category: post.categoryLabel,
    keywords: [post.categoryLabel, post.kicker, "The Zero"].filter(
      (value): value is string => Boolean(value),
    ),
    robots: newsRobots,
    openGraph: {
      ...base.openGraph,
      type: "article",
      url,
      publishedTime: post.dateIso,
      modifiedTime: post.updatedIso,
      authors: [post.author],
      section: post.categoryLabel,
      tags: [post.categoryLabel],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategory(post.category);
  const related = getRelatedPosts(post);
  const { newer, older } = getAdjacentPosts(post);
  const pageUrl = absoluteUrl(post.href);

  return (
    <article>
      <NewsArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        datePublished={post.dateIso}
        dateModified={post.updatedIso}
        url={pageUrl}
        section={post.categoryLabel}
        author={post.author}
        image={assetUrl(post.cover)}
        wordCount={post.wordCount}
        readingMinutes={post.readingMinutes}
      />
      <BreadcrumbJsonLd
        items={[
          { name: site.name, url: site.url },
          ...(category
            ? [{ name: category.label, url: absoluteUrl(category.href) }]
            : []),
          { name: post.title, url: pageUrl },
        ]}
      />
      <PageShell width="article">
        <header className="max-w-[46rem]">
          {category ? (
            <Breadcrumbs
              items={[
                { href: "/", label: "Newsroom" },
                { href: category.href, label: category.label },
                { label: post.title },
              ]}
            />
          ) : null}
          {category && (
            <Link href={category.href} className="eyebrow page-kicker">
              {post.kicker ?? category.label}
            </Link>
          )}
          <h1 className="story-title mt-2.5 font-semibold text-balance">
            {post.title}
          </h1>
          <p className="lede mt-3.5 text-pretty">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] tracking-[0.08em] text-muted uppercase sm:text-sm sm:tracking-normal sm:normal-case">
            <span className="font-medium text-fg normal-case">{post.author}</span>
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <time dateTime={post.dateIso}>{formatDate(post.date)}</time>
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <span>{readingTimeLabel(post.readingMinutes)}</span>
            {category ? (
              <>
                <span className="text-white/20" aria-hidden>
                  ·
                </span>
                <Link href={category.href} className="hover:text-accent">
                  {category.label}
                </Link>
              </>
            ) : null}
          </div>
        </header>

        {post.cover ? (
          <CoverImage
            src={post.cover}
            alt={coverAlt(post.title, post.coverCredit)}
            credit={post.coverCredit}
            priority
            flush
            sizes="(min-width: 1280px) 50rem, (min-width: 1024px) 64vw, 100vw"
            className="mt-5 -mx-4 max-w-[50rem] sm:mx-0 sm:mt-6"
          />
        ) : null}

        <div className="mt-7 grid gap-8 border-t border-white/10 pt-7 lg:grid-cols-[minmax(0,44rem)_minmax(17rem,1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <div>
            <ArticleBody source={post.content} />
            {(newer || older) && (
              <nav
                aria-label="Matérias vizinhas"
                className="mt-10 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-2"
              >
                {older ? (
                  <Link href={older.href} className="group block">
                    <p className="eyebrow text-muted">Mais antiga</p>
                    <p className="mt-2 font-semibold tracking-tight group-hover:text-accent">
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
                    </p>
                  </Link>
                ) : null}
              </nav>
            )}
          </div>
          <aside className="lg:sticky lg:top-24" aria-labelledby="mais-nesta-casa">
            <SectionHeading title="Mais nesta casa" as="h2" id="mais-nesta-casa" />
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
          </aside>
        </div>
      </PageShell>
    </article>
  );
}

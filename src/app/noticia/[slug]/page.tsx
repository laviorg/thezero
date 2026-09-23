import { ArticleBody } from "@/components/news/article-body";
import { ArticleDeskLinks } from "@/components/news/article-desk-links";
import { ArticleHeader } from "@/components/news/article-header";
import { ArticlePager } from "@/components/news/article-pager";
import { ArticleRail } from "@/components/news/article-rail";
import { CoverImage } from "@/components/news/cover-image";
import {
  BreadcrumbJsonLd,
  NewsArticleJsonLd,
} from "@/components/news/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { articleImages } from "@/lib/article-images";
import { getCategory, getSubcategory } from "@/lib/categories";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import {
  HOME_CRUMB_LABEL,
  articleOgImagePath,
  coverAlt,
  newsRobots,
} from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { articleHeadline } from "@/lib/titles";
import type { Metadata } from "next";
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

  const headline = articleHeadline(post);
  const url = absoluteUrl(post.href);
  const ogPath = articleOgImagePath(post.slug);
  const base = buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.excerpt,
    path: post.href,
    type: "article",
    brand: "auto",
    imagePath: ogPath,
    imageAlt: headline,
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
  const related = getRelatedPosts(post, 4);
  const { newer, older } = getAdjacentPosts(post);
  const pageUrl = absoluteUrl(post.href);
  const kicker = subcategory?.label ?? category?.label ?? post.kicker ?? "The Zero";
  const kickerHref = subcategory?.href ?? category?.href;
  const headline = articleHeadline(post);

  return (
    <article className="story-page">
      <div className="reading-progress" aria-hidden>
        <span />
      </div>
      <NewsArticleJsonLd
        headline={headline}
        description={post.excerpt}
        datePublished={post.dateIso}
        dateModified={post.updatedIso}
        url={pageUrl}
        section={post.categoryLabel}
        author={post.author}
        images={articleImages(post)}
        wordCount={post.wordCount}
        readingMinutes={post.readingMinutes}
        keywords={[
          post.categoryLabel,
          ...(post.subcategoryLabel ? [post.subcategoryLabel] : []),
          ...(post.kicker && post.kicker !== post.subcategoryLabel
            ? [post.kicker]
            : []),
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: HOME_CRUMB_LABEL, url: site.url },
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
      <div className="story-stage">
        <div className="story-stage-inner">
          <div
            className={
              post.cover ? "story-hero" : "story-hero story-hero--solo"
            }
          >
            <ArticleHeader
              title={post.title}
              excerpt={post.excerpt}
              kicker={kicker}
              kickerHref={kickerHref}
              author={post.author}
              date={post.date}
              dateIso={post.dateIso}
              updated={post.updated}
              updatedIso={post.updatedIso}
              readingMinutes={post.readingMinutes}
              crumbs={
                category
                  ? [
                      { href: "/", label: HOME_CRUMB_LABEL },
                      { href: category.href, label: category.label },
                      ...(subcategory
                        ? [{ href: subcategory.href, label: subcategory.label }]
                        : []),
                      { label: post.title },
                    ]
                  : undefined
              }
            />
            {post.cover ? (
              <CoverImage
                src={post.cover}
                alt={coverAlt(post.title, post.coverAlt)}
                credit={post.coverCredit}
                priority
                hero
                watermarkSize="default"
                sizes="(min-width: 960px) 38vw, calc(100vw - 2rem)"
                className="story-cover"
              />
            ) : null}
          </div>
        </div>
      </div>

      <PageShell width="article" className="story-body-shell">
        <div className="story-split">
          <div className="story-main">
            <ArticleBody source={post.content} />
            {category ? (
              <ArticleDeskLinks
                category={category}
                subcategory={subcategory}
              />
            ) : null}
            <ArticlePager older={older} newer={newer} />
          </div>
          <div className="story-rail">
            <ArticleRail posts={related} />
          </div>
        </div>
      </PageShell>
    </article>
  );
}

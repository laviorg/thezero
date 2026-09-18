import { ArticleBody } from "@/components/news/article-body";
import { ArticleCard } from "@/components/news/article-card";
import { CoverImage } from "@/components/news/cover-image";
import { NewsArticleJsonLd } from "@/components/news/json-ld";
import { getCategory } from "@/lib/categories";
import { formatDate, readingTimeLabel } from "@/lib/format";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
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

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: post.href },
    openGraph: {
      type: "article",
      locale: site.locale,
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.dateIso,
      modifiedTime: post.updatedIso,
      authors: [post.author],
      section: post.categoryLabel,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategory(post.category);
  const related = getRelatedPosts(post);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <NewsArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        datePublished={post.dateIso}
        dateModified={post.updatedIso}
        url={absoluteUrl(post.href)}
        section={post.categoryLabel}
        author={post.author}
        image={post.cover}
      />

      <header className="max-w-4xl border-b border-white/10 pb-10">
        {category && (
          <Link
            href={category.href}
            className="text-[0.7rem] font-medium tracking-[0.22em] text-accent uppercase"
          >
            {post.kicker ?? category.label}
          </Link>
        )}
        <h1 className="mt-4 text-[clamp(2.2rem,6.5vw,4.8rem)] font-semibold leading-[0.94] tracking-tight text-balance">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted text-pretty sm:text-xl">
          {post.excerpt}
        </p>
        <p className="mt-6 text-sm text-muted">
          <span className="text-fg">{post.author}</span>
          <span className="mx-2 text-white/20">/</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="mx-2 text-white/20">/</span>
          {readingTimeLabel(post.readingMinutes)}
        </p>
        {post.cover ? (
          <CoverImage
            src={post.cover}
            alt={post.title}
            credit={post.coverCredit}
            priority
            sizes="(min-width: 896px) 56rem, 100vw"
            className="mt-8"
          />
        ) : null}
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-16">
        <ArticleBody source={post.content} />
        <aside className="lg:pt-4">
          <p className="text-[0.7rem] tracking-[0.2em] text-muted uppercase">
            Mais nesta casa
          </p>
          <div className="mt-6 space-y-8">
            {related.map((item) => (
              <ArticleCard key={item.slug} post={item} priority="compact" />
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}

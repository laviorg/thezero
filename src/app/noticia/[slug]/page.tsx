import { ArticleBody } from "@/components/news/article-body";
import { ArticleCard } from "@/components/news/article-card";
import { CoverImage } from "@/components/news/cover-image";
import { NewsArticleJsonLd } from "@/components/news/json-ld";
import { SectionHeading } from "@/components/news/section-heading";
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
    <article className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
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

      <header className="max-w-3xl">
        {category && (
          <Link
            href={category.href}
            className="text-[0.65rem] font-medium tracking-[0.2em] text-accent uppercase"
          >
            {post.kicker ?? category.label}
          </Link>
        )}
        <h1 className="mt-3 text-[clamp(1.7rem,5.2vw,3.15rem)] font-semibold leading-[1.08] tracking-tight text-balance">
          {post.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-7 text-muted text-pretty sm:text-lg sm:leading-8">
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-medium text-fg">{post.author}</span>
          <span className="text-white/20" aria-hidden>
            ·
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
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
          alt={post.title}
          credit={post.coverCredit}
          priority
          flush
          sizes="(min-width: 896px) 56rem, 100vw"
          className="mt-6 -mx-4 max-w-4xl sm:mx-0 sm:mt-8"
        />
      ) : null}

      <div className="mt-8 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-14">
        <ArticleBody source={post.content} />
        <aside className="lg:pt-1">
          <SectionHeading title="Mais nesta casa" as="h2" />
          <div className="mt-1">
            {related.map((item) => (
              <ArticleCard
                key={item.slug}
                post={item}
                layout="pack"
                headingLevel="h3"
              />
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}

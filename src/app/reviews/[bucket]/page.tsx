import { ArticleCard } from "@/components/news/article-card";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { ReviewsMasthead } from "@/components/news/reviews-masthead";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { getActiveReviewBuckets, getReviewPostsByBucket } from "@/lib/posts";
import {
  getReviewBucket,
  reviewBucketDescription,
} from "@/lib/review-buckets";
import { HOME_CRUMB_LABEL } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { reviewBucketPageTitle } from "@/lib/titles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ReviewLinePageProps = {
  params: Promise<{ bucket: string }>;
};

export const dynamicParams = false;

/**
 * Format filter under `/reviews`. Not an editoria: `/reviews/celulares`
 * lists evergreen only and does not replace `/dispositivos/celulares`.
 */
export function generateStaticParams() {
  return getActiveReviewBuckets().map((bucket) => ({ bucket: bucket.slug }));
}

export async function generateMetadata({
  params,
}: ReviewLinePageProps): Promise<Metadata> {
  const { bucket: slug } = await params;
  const bucket = getReviewBucket(slug);
  if (!bucket) return {};

  const posts = getReviewPostsByBucket(bucket.slug);
  if (posts.length === 0) return {};

  const title = reviewBucketPageTitle(bucket);
  const description = reviewBucketDescription(bucket);

  return buildPageMetadata({
    title: bucket.seoTitle,
    description,
    path: bucket.href,
    brand: "always",
    imagePath: `${bucket.href}/opengraph-image`,
    imageAlt: title,
  });
}

export default async function ReviewLinePage({ params }: ReviewLinePageProps) {
  const { bucket: slug } = await params;
  const bucket = getReviewBucket(slug);
  if (!bucket) notFound();

  const posts = getReviewPostsByBucket(bucket.slug);
  if (posts.length === 0) notFound();

  const lines = getActiveReviewBuckets();
  const description = reviewBucketDescription(bucket);
  const pageUrl = absoluteUrl(bucket.href);

  return (
    <PageShell>
      <CollectionPageJsonLd
        name={bucket.label}
        description={description}
        url={pageUrl}
        items={posts.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: HOME_CRUMB_LABEL, url: site.url },
          { name: "Reviews", url: absoluteUrl("/reviews") },
          { name: bucket.label, url: pageUrl },
        ]}
      />

      <ReviewsMasthead
        crumbs={[
          { href: "/", label: HOME_CRUMB_LABEL },
          { href: "/reviews", label: "Reviews" },
          { label: bucket.label },
        ]}
        eyebrow="Reviews"
        title={bucket.label}
        lede={bucket.description}
        count={posts.length}
        lines={lines}
        current={bucket.slug}
      />

      <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard
            key={post.slug}
            post={post}
            layout="standard"
            headingLevel="h2"
          />
        ))}
      </div>
    </PageShell>
  );
}

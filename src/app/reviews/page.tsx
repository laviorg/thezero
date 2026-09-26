import { ArticleCard } from "@/components/news/article-card";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { ReviewsMasthead } from "@/components/news/reviews-masthead";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { getReviewPosts, groupReviewPosts } from "@/lib/posts";
import { HOME_CRUMB_LABEL } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { REVIEWS_HUB_CORE, reviewsPageTitle } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const DESCRIPTION =
  "PC, celular e console medidos no uso, com o preço em real. A editoria guarda o assunto; aqui fica a compra que ainda vale depois do lançamento.";

export function generateMetadata(): Metadata {
  const hasPosts = getReviewPosts().length > 0;
  const title = reviewsPageTitle();

  return buildPageMetadata({
    title: REVIEWS_HUB_CORE,
    description: DESCRIPTION,
    path: "/reviews",
    brand: "always",
    imagePath: "/opengraph-image",
    imageAlt: title,
    noIndex: !hasPosts,
  });
}

export default function ReviewsPage() {
  const { groups, rest } = groupReviewPosts();
  const posts = [
    ...groups.flatMap((group) => group.posts),
    ...rest,
  ];
  const lines = groups.map((group) => group.bucket);
  const pageUrl = absoluteUrl("/reviews");

  return (
    <PageShell>
      <CollectionPageJsonLd
        name="Reviews"
        description={DESCRIPTION}
        url={pageUrl}
        items={posts.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: HOME_CRUMB_LABEL, url: site.url },
          { name: "Reviews", url: pageUrl },
        ]}
      />

      <ReviewsMasthead
        crumbs={[
          { href: "/", label: HOME_CRUMB_LABEL },
          { label: "Reviews" },
        ]}
        eyebrow="Uso, não ficha"
        title="Reviews"
        lede={DESCRIPTION}
        count={posts.length}
        lines={lines}
      />

      <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
        A decisão de compra, com veredito curto, está em{" "}
        <Link href="/vale-a-pena" className="text-accent">
          Vale a pena?
        </Link>
        .
      </p>

      {posts.length === 0 ? (
        <p className="mt-6 max-w-xl text-muted">
          Ainda não há review nesta página. Quando entrar, aparece aqui e
          também na editoria do aparelho.
        </p>
      ) : (
        <>
          {groups.map((group) => (
            <section
              key={group.bucket.slug}
              className="mt-10"
              aria-labelledby={`linha-${group.bucket.slug}`}
            >
              <SectionHeading
                id={`linha-${group.bucket.slug}`}
                title={group.bucket.label}
                href={group.bucket.href}
                actionLabel="Ver tudo"
              />
              <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {group.posts.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="standard"
                    headingLevel="h3"
                  />
                ))}
              </div>
            </section>
          ))}
          {rest.length > 0 ? (
            <section className="mt-10" aria-labelledby="reviews-resto">
              <SectionHeading id="reviews-resto" title="Também no arquivo" />
              <p className="mt-3 max-w-2xl text-sm text-muted">
                Guias que não cabem numa linha de produto. Continuam neste hub.
              </p>
              <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="standard"
                    headingLevel="h3"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}

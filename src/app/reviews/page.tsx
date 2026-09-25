import { ArticleCard } from "@/components/news/article-card";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { getReviewPosts } from "@/lib/posts";
import { HOME_CRUMB_LABEL } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { REVIEWS_HUB_CORE, reviewsPageTitle } from "@/lib/titles";
import type { Metadata } from "next";

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
  const posts = getReviewPosts();
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

      <header className="newsroom-masthead max-w-4xl border-b border-border border-l border-l-accent/40 pb-5 pl-4 sm:pl-5">
        <Breadcrumbs
          items={[
            { href: "/", label: HOME_CRUMB_LABEL },
            { label: "Reviews" },
          ]}
        />
        <p className="eyebrow page-kicker">Uso, não ficha</p>
        <h1 className="page-title mt-2 font-extrabold text-balance">Reviews</h1>
        <p className="lede mt-3 text-pretty">{DESCRIPTION}</p>
        <p className="mt-4 text-[0.72rem] tracking-[0.14em] text-muted uppercase">
          {posts.length === 0
            ? "Nenhuma matéria"
            : posts.length === 1
              ? "1 matéria"
              : `${posts.length} matérias`}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-6 max-w-xl text-muted">
          Ainda não há review nesta página. Quando entrar, aparece aqui e
          também na editoria do aparelho.
        </p>
      ) : (
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
      )}
    </PageShell>
  );
}

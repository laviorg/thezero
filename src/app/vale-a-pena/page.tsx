import { ArticleCard } from "@/components/news/article-card";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { getPostsByFormat } from "@/lib/posts";
import { HOME_CRUMB_LABEL } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { VALE_A_PENA_HUB_CORE, valeAPenaPageTitle } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const DESCRIPTION =
  "Comprar, esperar ou ficar na geração anterior. Veredito curto, preço em real com data e o que a ficha sustenta — sem nota de 0 a 10.";

export function generateMetadata(): Metadata {
  const hasPosts = getPostsByFormat("vale-a-pena").length > 0;
  const title = valeAPenaPageTitle();

  return buildPageMetadata({
    title: VALE_A_PENA_HUB_CORE,
    description: DESCRIPTION,
    path: "/vale-a-pena",
    brand: "always",
    imagePath: "/opengraph-image",
    imageAlt: title,
    noIndex: !hasPosts,
  });
}

export default function ValeAPenaPage() {
  const posts = getPostsByFormat("vale-a-pena");
  const pageUrl = absoluteUrl("/vale-a-pena");

  return (
    <PageShell>
      <CollectionPageJsonLd
        name="Vale a pena?"
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
          { name: "Vale a pena?", url: pageUrl },
        ]}
      />

      <header className="newsroom-masthead max-w-4xl border-b border-border border-l border-l-accent/40 pb-5 pl-4 sm:pl-5">
        <Breadcrumbs
          items={[
            { href: "/", label: HOME_CRUMB_LABEL },
            { label: "Vale a pena?" },
          ]}
        />
        <p className="eyebrow page-kicker">Decisão de compra</p>
        <h1 className="page-title mt-2 font-extrabold text-balance">
          Vale a pena?
        </h1>
        <p className="lede mt-3 text-pretty">{DESCRIPTION}</p>
        <p className="mt-4 text-[0.72rem] tracking-[0.14em] text-muted uppercase">
          {posts.length === 1 ? "1 matéria" : `${posts.length} matérias`}
        </p>
      </header>

      <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
        O arquivo de uso continua em{" "}
        <Link href="/reviews" className="text-accent">
          Reviews
        </Link>
        . O método — pesquisa quando não há bancada, preço com data — está
        em{" "}
        <Link href="/como-testamos" className="text-accent">
          Como testamos
        </Link>
        .
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 max-w-xl text-muted">
          Ainda não há decisão nesta série.
        </p>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} layout="standard" />
          ))}
        </div>
      )}
    </PageShell>
  );
}

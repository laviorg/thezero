import { ArticleCard } from "@/components/news/article-card";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { categoryList, getCategory, isCategorySlug } from "@/lib/categories";
import { buildPageMetadata } from "@/lib/metadata";
import { getPostsByCategory } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryList.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const title = category.label;
  const description = `${category.label} no The Zero. ${category.description}`;

  return buildPageMetadata({
    title,
    description,
    path: category.href,
    imagePath: `/${category.slug}/opengraph-image`,
    imageAlt: `${category.label} · ${site.name}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const category = getCategory(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category.slug);
  const featured = posts[0];
  const rest = posts.slice(1);
  const pageUrl = absoluteUrl(category.href);

  return (
    <PageShell>
      <CollectionPageJsonLd
        name={`${category.label} · ${site.name}`}
        description={`${category.label} no The Zero. ${category.description}`}
        url={pageUrl}
        items={posts.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: site.name, url: site.url },
          { name: category.label, url: pageUrl },
        ]}
      />

      <header className="max-w-3xl border-b border-white/10 pb-5">
        <Breadcrumbs
          items={[
            { href: "/", label: "Newsroom" },
            { label: category.label },
          ]}
        />
        <p className="eyebrow page-kicker">{category.kicker}</p>
        <h1 className="page-title mt-2 font-semibold text-balance">
          {category.label}
        </h1>
        <p className="lede mt-3 text-pretty">
          {category.description}
        </p>
        <p className="mt-4 text-[0.72rem] tracking-[0.14em] text-muted uppercase">
          {posts.length === 0
            ? "Nenhuma matéria"
            : posts.length === 1
              ? "1 matéria"
              : `${posts.length} matérias`}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-8 max-w-xl text-muted">
          Zero matérias nesta editoria por enquanto. Volta amanhã — ou manda
          pauta no Instagram.
        </p>
      ) : (
        <div
          className={
            rest.length > 0 ? "mt-6 grid gap-6 lg:grid-cols-12 lg:gap-8" : "mt-6"
          }
        >
          {featured ? (
            <div className={rest.length > 0 ? "lg:col-span-7 xl:col-span-8" : "max-w-3xl"}>
              <ArticleCard
                post={featured}
                layout="lead"
                headingLevel="h2"
              />
            </div>
          ) : null}
          {rest.length > 0 ? (
            <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-6 xl:col-span-4">
              <SectionHeading title="Nesta editoria" as="h2" />
              <div className="mt-1">
                {rest.slice(0, 6).map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    layout="stream"
                    headingLevel="h3"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <nav
        aria-label="Outras editorias"
        className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-5"
      >
        {categoryList
          .filter((item) => item.slug !== category.slug)
          .map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="chip-link"
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </PageShell>
  );
}

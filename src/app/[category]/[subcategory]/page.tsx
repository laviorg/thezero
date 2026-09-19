import { PageShell } from "@/components/layout/page-shell";
import { ArticleCard } from "@/components/news/article-card";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/news/json-ld";
import { SectionHeading } from "@/components/news/section-heading";
import { getCategory, getSubcategory } from "@/lib/categories";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getActiveSubcategories,
  getPostsBySubcategory,
} from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type SubcategoryPageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveSubcategories().map((subcategory) => ({
    category: subcategory.parent,
    subcategory: subcategory.slug,
  }));
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const category = getCategory(categorySlug);
  const subcategory = getSubcategory(categorySlug, subcategorySlug);
  if (!category || !subcategory) return {};

  const title = `${subcategory.label} em ${category.label}`;
  const description = `${subcategory.label} no The Zero. ${subcategory.description}`;

  return buildPageMetadata({
    title,
    description,
    path: subcategory.href,
    imagePath: `${subcategory.href}/opengraph-image`,
    imageAlt: `${subcategory.label} · ${site.name}`,
  });
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const category = getCategory(categorySlug);
  const subcategory = getSubcategory(categorySlug, subcategorySlug);
  if (!category || !subcategory) notFound();

  const posts = getPostsBySubcategory(category.slug, subcategory.slug);
  if (posts.length === 0) notFound();

  const featured = posts[0];
  const rest = posts.slice(1);
  const pageUrl = absoluteUrl(subcategory.href);
  const siblings = getActiveSubcategories(category.slug).filter(
    (item) => item.slug !== subcategory.slug,
  );

  return (
    <PageShell>
      <CollectionPageJsonLd
        name={`${subcategory.label} em ${category.label} · ${site.name}`}
        description={`${subcategory.label} no The Zero. ${subcategory.description}`}
        url={pageUrl}
        items={posts.map((post) => ({
          name: post.title,
          url: absoluteUrl(post.href),
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: site.name, url: site.url },
          { name: category.label, url: absoluteUrl(category.href) },
          { name: subcategory.label, url: pageUrl },
        ]}
      />

      <header className="newsroom-masthead max-w-4xl border-b border-border border-l border-l-accent/40 pb-5 pl-4 sm:pl-5">
        <Breadcrumbs
          items={[
            { href: "/", label: "Newsroom" },
            { href: category.href, label: category.label },
            { label: subcategory.label },
          ]}
        />
        <p className="eyebrow page-kicker">{category.label}</p>
        <h1 className="page-title mt-2 font-semibold text-balance">
          {subcategory.label}
        </h1>
        <p className="lede mt-3 text-pretty">{subcategory.description}</p>
        <p className="mt-4 text-[0.72rem] tracking-[0.14em] text-muted uppercase">
          {posts.length === 1 ? "1 matéria" : `${posts.length} matérias`}
        </p>
      </header>

      <div className="mt-6 max-w-4xl">
        <ArticleCard post={featured} layout="lead" headingLevel="h2" />
      </div>

      {rest.length > 0 ? (
        <section className="mt-9 border-t border-border pt-7">
          <SectionHeading title={`Mais em ${subcategory.label}`} as="h2" />
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

      <nav
        aria-label={`Mais assuntos em ${category.label}`}
        className="mt-10 flex flex-wrap gap-2 border-t border-border pt-5"
      >
        <Link href={category.href} className="chip-link">
          Tudo em {category.label}
        </Link>
        {siblings.map((item) => (
          <Link key={item.slug} href={item.href} className="chip-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}

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
import {
  getActiveSubcategories,
  getAllPosts,
  getPostsByCategory,
} from "@/lib/posts";
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
  const activeSubcategories = getActiveSubcategories(category.slug);
  const featured = posts[0];
  const rest = posts.slice(1);
  const pageUrl = absoluteUrl(category.href);
  const elsewhere = getAllPosts().filter(
    (post) => post.category !== category.slug,
  );

  /**
   * The side rail only pays off next to a lead with a cover: a short text-only
   * lead beside a tall rail is exactly what leaves dead space on the hub.
   */
  const useRail = Boolean(featured?.cover) && rest.length > 0;
  /**
   * Four rows keep the rail just under the lead's height, so the leftover lands
   * in the rail's bottom link instead of as dead space beside it.
   */
  const railOwn = useRail ? rest.slice(0, 4) : [];
  const railMixed = useRail && railOwn.length < 4;
  const railPosts = railMixed
    ? [...railOwn, ...elsewhere.slice(0, 4 - railOwn.length)]
    : railOwn;
  const gridPosts = useRail ? rest.slice(4) : rest;
  const newsroomFill = !useRail && rest.length < 4 ? elsewhere.slice(0, 6) : [];

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

      <header className="newsroom-masthead max-w-4xl border-b border-white/10 border-l border-l-accent/40 pb-5 pl-4 sm:pl-5">
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
        {activeSubcategories.length > 0 ? (
          <nav
            aria-label={`Assuntos em ${category.label}`}
            className="mt-5 flex flex-wrap gap-2"
          >
            {activeSubcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={subcategory.href}
                className="chip-link"
              >
                {subcategory.label}
              </Link>
            ))}
          </nav>
        ) : null}
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
          Zero matérias nesta editoria por enquanto. Volta amanhã — ou manda
          pauta no Instagram.
        </p>
      ) : useRail ? (
        <div className="newsroom-lead mt-6 grid gap-7 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <ArticleCard post={featured} layout="lead" headingLevel="h2" />
          </div>
          <div className="flex flex-col border-t border-white/10 pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
            <SectionHeading
              title={railMixed ? "Leia também" : "Nesta editoria"}
              as="h2"
            />
            <div className="mt-1">
              {railPosts.map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  layout="stream"
                  headingLevel="h3"
                />
              ))}
            </div>
            <Link
              href="/busca"
              className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.78rem] font-medium tracking-[0.12em] text-accent uppercase transition-colors hover:text-fg"
            >
              Ver todo o newsroom
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-4xl">
          <ArticleCard post={featured} layout="lead" headingLevel="h2" />
        </div>
      )}

      {gridPosts.length > 0 ? (
        <section className="mt-9 border-t border-white/10 pt-7">
          <SectionHeading title={`Mais em ${category.label}`} as="h2" />
          <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {gridPosts.map((post) => (
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

      {newsroomFill.length > 0 ? (
        <section className="mt-9 border-t border-white/10 pt-7">
          <SectionHeading
            title="Últimas no newsroom"
            as="h2"
            href="/busca"
            actionLabel="Ver tudo"
          />
          <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {newsroomFill.map((post) => (
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

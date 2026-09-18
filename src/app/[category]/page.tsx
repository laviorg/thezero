import { ArticleCard } from "@/components/news/article-card";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { categoryList, getCategory, isCategorySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { site } from "@/lib/site";
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

  return {
    title,
    description,
    alternates: { canonical: category.href },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: category.href,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const category = getCategory(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category.slug);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <PageShell>
      <header className="max-w-3xl border-b border-white/10 pb-6">
        <p className="text-[0.65rem] font-medium tracking-[0.2em] text-accent uppercase">
          {category.kicker}
        </p>
        <h1 className="mt-2 text-[clamp(1.85rem,4.5vw,3rem)] font-semibold leading-[1.05] tracking-tight text-balance">
          {category.label}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted text-pretty sm:text-lg">
          {category.description}
        </p>
        <p className="mt-4 text-xs tracking-wide text-muted uppercase">
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
            rest.length > 0
              ? "mt-7 grid gap-10 lg:grid-cols-12"
              : "mt-7"
          }
        >
          {featured ? (
            <div className={rest.length > 0 ? "lg:col-span-7" : "max-w-3xl"}>
              <ArticleCard
                post={featured}
                layout="lead"
                headingLevel="h2"
              />
            </div>
          ) : null}
          {rest.length > 0 ? (
            <div className="lg:col-span-5">
              <SectionHeading title="Nesta editoria" as="h2" />
              <div className="mt-1">
                {rest.map((post) => (
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
        className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-6"
      >
        {categoryList
          .filter((item) => item.slug !== category.slug)
          .map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="border border-white/12 px-3 py-1.5 text-[0.8rem] tracking-wide text-muted uppercase transition-colors hover:border-accent hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </PageShell>
  );
}

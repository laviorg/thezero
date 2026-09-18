import { ArticleCard } from "@/components/news/article-card";
import { categoryList, getCategory, isCategorySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { site } from "@/lib/site";
import type { Metadata } from "next";
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-[0.7rem] font-medium tracking-[0.22em] text-accent uppercase">
        {category.kicker}
      </p>
      <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[0.92] tracking-tight text-balance">
        {category.label}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
        {category.description}
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 max-w-xl text-muted">
          Zero matérias nesta editoria por enquanto. Volta amanhã — ou manda
          pauta no Instagram.
        </p>
      ) : (
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {posts.map((post, index) => (
            <ArticleCard
              key={post.slug}
              post={post}
              priority={index === 0 ? "standard" : "standard"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

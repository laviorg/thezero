import { ArticleCard } from "@/components/news/article-card";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { SearchForm } from "@/components/search/search-form";
import { categoryList } from "@/lib/categories";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPosts, searchPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  const pageMetadata = buildPageMetadata({
    title: query ? `Busca: ${query}` : "Busca",
    description: "Busca no newsroom do The Zero. Título, trecho, editoria.",
    path: "/busca",
    noIndex: true,
    imagePath: "/opengraph-image",
    imageAlt: `${site.name} — ${site.tagline}`,
  });

  return {
    ...pageMetadata,
    robots: { index: false, follow: true, nocache: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchPosts(query) : [];
  const latest = getAllPosts().slice(0, 6);

  return (
    <PageShell>
      <div className="max-w-3xl border-l border-l-accent/40 pl-4 sm:pl-5">
        <p className="eyebrow page-kicker">Busca</p>
        <h1 className="page-title mt-2.5 font-semibold text-balance">
          {query ? `Resultados para “${query}”` : "O que você quer cortar o hype."}
        </h1>
        <p className="lede mt-3 mb-5">
          Newsroom inteiro, no repo. Sem caixa-preta.
        </p>
        <SearchForm defaultValue={query} autoFocus={!query} />

        {!query && (
          <div className="mt-6">
            <p className="text-sm text-muted">
              Tenta Cursor, Steam Deck, prompt ou setup — ou entra direto numa
              editoria.
            </p>
            <nav aria-label="Editorias" className="mt-3 flex flex-wrap gap-2">
              {categoryList.map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  className="chip-link"
                >
                  {category.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {query && results.length === 0 && (
          <p className="mt-7 text-[1.02rem] text-muted">
            Zero resultados pra “{query}”. Ou não existe, ou o hype ainda não
            passou no critério.
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-7">
            <p className="eyebrow mb-2 text-muted">
              {results.length === 1
                ? "1 matéria"
                : `${results.length} matérias`}
            </p>
            {results.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                layout="stream"
                headingLevel="h2"
              />
            ))}
          </div>
        )}
      </div>

      {results.length === 0 && latest.length > 0 ? (
        <section className="mt-9 border-t border-white/10 pt-7">
          <SectionHeading title="Últimas no newsroom" as="h2" />
          <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {latest.map((post) => (
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
    </PageShell>
  );
}

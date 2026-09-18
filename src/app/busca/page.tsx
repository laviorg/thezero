import { ArticleCard } from "@/components/news/article-card";
import { PageShell } from "@/components/layout/page-shell";
import { SearchForm } from "@/components/search/search-form";
import { categoryList } from "@/lib/categories";
import { searchPosts } from "@/lib/posts";
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
  return {
    title: query ? `Busca: ${query}` : "Busca",
    description: "Busca no newsroom do The Zero. Título, trecho, editoria.",
    alternates: { canonical: query ? `/busca?q=${encodeURIComponent(query)}` : "/busca" },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchPosts(query) : [];

  return (
    <PageShell width="narrow">
      <p className="text-[0.65rem] font-medium tracking-[0.2em] text-accent uppercase">
        Busca
      </p>
      <h1 className="mt-3 text-[clamp(1.7rem,5vw,2.8rem)] font-semibold leading-[1.08] tracking-tight">
        {query ? `Resultados para “${query}”` : "O que você quer cortar o hype."}
      </h1>
      <p className="mt-3 mb-6 text-muted">
        Newsroom inteiro, no repo. Sem caixa-preta.
      </p>
      <SearchForm defaultValue={query} autoFocus={!query} />

      {!query && (
        <div className="mt-8">
          <p className="text-sm text-muted">
            Tenta Cursor, Steam Deck, prompt ou setup — ou entra direto numa
            editoria.
          </p>
          <nav
            aria-label="Editorias"
            className="mt-4 flex flex-wrap gap-2"
          >
            {categoryList.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="border border-white/12 px-3 py-1.5 text-[0.8rem] tracking-wide text-muted uppercase transition-colors hover:border-accent hover:text-accent"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {query && results.length === 0 && (
        <p className="mt-8 text-lg text-muted">
          Zero resultados pra “{query}”. Ou não existe, ou o hype ainda não
          passou no critério.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <p className="mb-2 text-sm text-muted">
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
    </PageShell>
  );
}

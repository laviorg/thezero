import { ArticleCard } from "@/components/news/article-card";
import { SearchForm } from "@/components/search/search-form";
import { searchPosts } from "@/lib/posts";
import type { Metadata } from "next";

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
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-[0.7rem] font-medium tracking-[0.22em] text-accent uppercase">
        Busca
      </p>
      <h1 className="mt-4 text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[0.94] tracking-tight">
        {query ? `Resultados para “${query}”` : "O que você quer cortar o hype."}
      </h1>
      <p className="mt-4 mb-8 text-muted">
        Newsroom inteiro, no repo. Sem caixa-preta.
      </p>
      <SearchForm defaultValue={query} autoFocus={!query} />

      {!query && (
        <p className="mt-10 text-muted">
          Tenta <span className="text-fg">Cursor</span>,{" "}
          <span className="text-fg">Steam Deck</span>,{" "}
          <span className="text-fg">prompt</span> ou{" "}
          <span className="text-fg">setup</span>.
        </p>
      )}

      {query && results.length === 0 && (
        <p className="mt-10 text-lg text-muted">
          Zero resultados pra “{query}”. Ou não existe, ou o hype ainda não
          passou no critério.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-12 space-y-10">
          <p className="text-sm text-muted">
            {results.length === 1
              ? "1 matéria"
              : `${results.length} matérias`}
          </p>
          {results.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

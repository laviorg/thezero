import { ArticleCard } from "@/components/news/article-card";
import { SectionHeading } from "@/components/news/section-heading";
import { PageShell } from "@/components/layout/page-shell";
import { SearchForm } from "@/components/search/search-form";
import { categoryList } from "@/lib/categories";
import type { Post } from "@/lib/posts";
import Link from "next/link";

export function SearchScreen({
  query,
  results,
  latest,
  pending = false,
  error = false,
}: {
  query: string;
  results: Post[];
  latest: Post[];
  pending?: boolean;
  error?: boolean;
}) {
  const showIdle = !pending && !error;

  return (
    <PageShell>
      <div className="max-w-3xl border-l border-l-accent/40 pl-4 sm:pl-5">
        <p className="eyebrow page-kicker">Busca</p>
        <h1 className="page-title mt-2.5 font-extrabold text-balance">
          {query ? `Resultados para “${query}”` : "O que você quer cortar o hype."}
        </h1>
        <p className="lede mt-3 mb-5">
          Newsroom inteiro, no repo. Sem caixa-preta.
        </p>
        <SearchForm key={query} defaultValue={query} autoFocus={!query} />

        {pending ? (
          <p className="mt-6 text-sm text-muted">Carregando a busca…</p>
        ) : null}

        {error ? (
          <p className="mt-6 text-sm text-muted">
            Não deu para carregar o índice da busca.
          </p>
        ) : null}

        {showIdle && !query && (
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

        {showIdle && query && results.length === 0 && (
          <p className="mt-7 text-[1.02rem] text-muted">
            Zero resultados pra “{query}”. Ou não existe, ou o hype ainda não
            passou no critério.
          </p>
        )}

        {showIdle && results.length > 0 && (
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

      {showIdle && results.length === 0 && latest.length > 0 ? (
        <section className="mt-9 border-t border-border pt-7">
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

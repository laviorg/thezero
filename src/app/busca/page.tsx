import { SearchScreen } from "@/components/search/search-screen";
import { buildPageMetadata } from "@/lib/metadata";
import { getNewsPosts, searchPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { searchPageTitle } from "@/lib/titles";
import type { Metadata } from "next";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  const pageMetadata = buildPageMetadata({
    title: searchPageTitle(query),
    description: "Busca no newsroom do The Zero. Título, trecho, editoria.",
    path: "/busca",
    brand: "never",
    noIndex: true,
    imagePath: "/opengraph-image",
    imageAlt: site.name,
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
  const latest = getNewsPosts().slice(0, 6);

  return <SearchScreen query={query} results={results} latest={latest} />;
}

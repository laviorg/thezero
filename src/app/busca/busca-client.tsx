"use client";

import { SearchScreen } from "@/components/search/search-screen";
import { isNewsFormat } from "@/lib/post-format";
import type { Post } from "@/lib/posts";
import { postMatchesQuery } from "@/lib/search-match";
import { searchPageTitle } from "@/lib/titles";
import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function readQuery() {
  return new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
}

function emptyQuery() {
  return "";
}

/**
 * Static-export search. The Vercel page still renders on the server.
 * The Cloudflare build swaps `page.tsx` for `page.cloudflare.tsx`, which
 * mounts this island. The haystack is `postMatchesQuery`, the same function
 * `searchPosts` uses.
 */
export function BuscaClient() {
  const query = useSyncExternalStore(subscribeToLocation, readQuery, emptyQuery)
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (query) document.title = searchPageTitle(query);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<Post[]>;
      })
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const results =
    posts && query ? posts.filter((post) => postMatchesQuery(post, query)) : [];
  const latest = posts ? posts.filter(isNewsFormat).slice(0, 6) : [];

  return (
    <>
      <noscript>
        <p className="mx-auto max-w-3xl px-4 py-4 text-sm text-muted">
          A busca neste host precisa de JavaScript.
        </p>
      </noscript>
      {error ? (
        <SearchScreen query={query} results={[]} latest={[]} error />
      ) : !posts ? (
        <SearchScreen query={query} results={[]} latest={[]} pending />
      ) : (
        <SearchScreen query={query} results={results} latest={latest} />
      )}
    </>
  );
}

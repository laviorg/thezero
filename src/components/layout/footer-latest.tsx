"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LatestPost = { title: string; href: string };

export function FooterLatest({ initial }: { initial: LatestPost[] }) {
  const [posts, setPosts] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetch("/latest.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { posts?: LatestPost[] } | null) => {
        if (!cancelled && data?.posts?.length) setPosts(data.posts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <nav
      aria-label="Últimas matérias"
      className="shell-frame relative border-t border-border py-6"
    >
      <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
        Últimas
      </p>
      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <li key={post.href}>
            <Link
              href={post.href}
              className="line-clamp-3 text-sm leading-snug text-fg/90 transition-colors hover:text-accent"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

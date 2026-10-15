import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export function GuiasDoTema({ slugs }: { slugs: string[] }) {
  const posts = getAllPosts();
  const items = slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  if (items.length === 0) return null;

  return (
    <nav className="guias-do-tema my-10 min-w-0" aria-label="Guias deste tema">
      <h2 className="article-h2">Guias deste tema</h2>
      <ul className="my-3.5 list-disc space-y-1.5 pl-5 leading-[1.72]">
        {items.map((post) => (
          <li key={post.slug} className="pl-1">
            <Link href={post.href} className="article-link">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

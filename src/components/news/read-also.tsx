import { CoverImage } from "@/components/news/cover-image";
import type { Post } from "@/lib/posts";
import { coverAlt } from "@/lib/seo";
import Link from "next/link";

/**
 * "Leia também": 3 matérias do mesmo assunto (termos do slug, subeditoria,
 * editoria; sem relação, as mais recentes), com capa e título. Sem a matéria
 * atual, sem páginas noindex e sem matérias já linkadas no corpo do texto.
 */
export function ReadAlso({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="read-also" aria-labelledby="leia-tambem">
      <h2 id="leia-tambem" className="read-also-title">
        Leia também
      </h2>
      <ul className="read-also-list">
        {posts.map((post) => (
          <li key={post.slug} className="read-also-item">
            <Link href={post.href} className="read-also-link">
              {post.cover ? (
                <CoverImage
                  src={post.cover}
                  alt={coverAlt(post.title, post.coverAlt)}
                  crop
                  watermarkSize="micro"
                  sizes="(min-width: 960px) 14rem, 45vw"
                  className="read-also-thumb"
                />
              ) : null}
              <span className="read-also-item-title">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { CoverImage } from "@/components/news/cover-image";
import { categoryList } from "@/lib/categories";
import { formatShortDate } from "@/lib/format";
import type { Post } from "@/lib/posts";
import { coverAlt } from "@/lib/seo";
import Link from "next/link";

type ArticleRailProps = {
  posts: Post[];
};

export function ArticleRail({ posts }: ArticleRailProps) {
  return (
    <aside className="article-aside" aria-labelledby="mais-nesta-casa">
      <p className="story-rail-kicker">Nesta casa</p>
      <h2 id="mais-nesta-casa" className="story-rail-title">
        Mais para ler
      </h2>
      <ol className="story-rail-list">
        {posts.map((post, index) => {
          const kicker = post.kicker ?? post.subcategoryLabel ?? post.categoryLabel;
          return (
            <li key={post.slug} className="story-rail-item">
              <Link href={post.href} className="story-rail-link">
                <span className="story-rail-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="story-rail-copy">
                  <span className="story-rail-item-kicker">{kicker}</span>
                  <span className="story-rail-item-title">{post.title}</span>
                  <span className="story-rail-item-meta">
                    <time dateTime={post.dateIso}>{formatShortDate(post.date)}</time>
                    <span aria-hidden> · </span>
                    {post.readingMinutes} min
                  </span>
                </span>
                {post.cover ? (
                  <CoverImage
                    src={post.cover}
                    alt={coverAlt(post.title, post.coverAlt)}
                    crop
                    zoom
                    watermarkSize="micro"
                    sizes="6rem"
                    className="story-rail-thumb"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="story-rail-kicker story-rail-desks">Editorias</p>
      <nav aria-label="Editorias" className="mt-3 flex flex-wrap gap-2">
        {categoryList.map((item) => (
          <Link key={item.slug} href={item.href} className="chip-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

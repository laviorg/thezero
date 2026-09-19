import type { Post } from "@/lib/posts";
import Link from "next/link";

export function ArticlePager({
  older,
  newer,
}: {
  older?: Post;
  newer?: Post;
}) {
  if (!older && !newer) return null;

  return (
    <nav aria-label="Matérias vizinhas" className="story-pager">
      {older ? (
        <Link href={older.href} className="story-pager-link">
          <p className="story-pager-label">Mais antiga</p>
          <p className="story-pager-title">
            <span aria-hidden>← </span>
            {older.title}
          </p>
        </Link>
      ) : (
        <span />
      )}
      {newer ? (
        <Link href={newer.href} className="story-pager-link story-pager-link-next">
          <p className="story-pager-label">Mais recente</p>
          <p className="story-pager-title">
            {newer.title}
            <span aria-hidden> →</span>
          </p>
        </Link>
      ) : null}
    </nav>
  );
}

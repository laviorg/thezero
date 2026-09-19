import { Breadcrumbs, type Crumb } from "@/components/news/breadcrumbs";
import { formatDate, readingTimeLabel } from "@/lib/format";
import Link from "next/link";

type ArticleHeaderProps = {
  title: string;
  excerpt: string;
  kicker: string;
  kickerHref?: string;
  author: string;
  authorHref?: string;
  date: string;
  dateIso: string;
  updated?: string;
  updatedIso?: string;
  readingMinutes: number;
  crumbs?: Crumb[];
  sectionLabel?: string;
  sectionHref?: string;
};

export function ArticleHeader({
  title,
  excerpt,
  kicker,
  kickerHref,
  author,
  authorHref = "/sobre",
  date,
  dateIso,
  updated,
  updatedIso,
  readingMinutes,
  crumbs,
  sectionLabel,
  sectionHref,
}: ArticleHeaderProps) {
  return (
    <header className="story-header">
      {crumbs && crumbs.length > 0 ? (
        <Breadcrumbs items={crumbs} className="story-crumbs" />
      ) : null}

      {kickerHref ? (
        <Link href={kickerHref} className="story-kicker">
          {kicker}
        </Link>
      ) : (
        <p className="story-kicker">{kicker}</p>
      )}

      <h1 className="story-title mt-4 text-balance">{title}</h1>
      <p className="lede story-dek mt-5 text-pretty">{excerpt}</p>

      <div className="story-byline">
        <p className="story-byline-author">
          <span className="story-byline-by">Por </span>
          <Link href={authorHref} className="story-byline-name">
            {author}
          </Link>
        </p>
        <p className="story-byline-meta">
          <time dateTime={dateIso}>{formatDate(date)}</time>
          {updated && updated !== date && updatedIso ? (
            <>
              <span className="story-byline-dot" aria-hidden>
                ·
              </span>
              <span>
                Atualizado em{" "}
                <time dateTime={updatedIso}>{formatDate(updated)}</time>
              </span>
            </>
          ) : null}
          <span className="story-byline-dot" aria-hidden>
            ·
          </span>
          <span>{readingTimeLabel(readingMinutes)}</span>
          {sectionLabel && sectionHref ? (
            <>
              <span className="story-byline-dot" aria-hidden>
                ·
              </span>
              <Link href={sectionHref} className="story-byline-section">
                {sectionLabel}
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </header>
  );
}

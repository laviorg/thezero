import { Breadcrumbs, type Crumb } from "@/components/news/breadcrumbs";
import type { ReviewBucket } from "@/lib/review-buckets";
import Link from "next/link";

function matterCountLabel(count: number): string {
  if (count === 0) return "Nenhuma matéria";
  if (count === 1) return "1 matéria";
  return `${count} matérias`;
}

export function ReviewsLineNav({
  lines,
  current,
}: {
  lines: readonly Pick<ReviewBucket, "slug" | "href" | "label">[];
  current?: string;
}) {
  if (lines.length === 0) return null;

  return (
    <nav aria-label="Linhas de produto" className="mt-5 flex flex-wrap gap-2">
      <Link
        href="/reviews"
        className="chip-link"
        aria-current={current ? undefined : "page"}
      >
        Tudo
      </Link>
      {lines.map((line) => (
        <Link
          key={line.slug}
          href={line.href}
          className="chip-link"
          aria-current={current === line.slug ? "page" : undefined}
        >
          {line.label}
        </Link>
      ))}
    </nav>
  );
}

export function ReviewsMasthead({
  crumbs,
  eyebrow,
  title,
  lede,
  count,
  lines,
  current,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  lede: string;
  count: number;
  lines: readonly Pick<ReviewBucket, "slug" | "href" | "label">[];
  current?: string;
}) {
  return (
    <header className="newsroom-masthead max-w-4xl border-b border-border border-l border-l-accent/40 pb-5 pl-4 sm:pl-5">
      <Breadcrumbs items={crumbs} />
      <p className="eyebrow page-kicker">{eyebrow}</p>
      <h1 className="page-title mt-2 font-extrabold text-balance">{title}</h1>
      <p className="lede mt-3 text-pretty">{lede}</p>
      <ReviewsLineNav lines={lines} current={current} />
      <p className="mt-4 text-[0.72rem] tracking-[0.14em] text-muted uppercase">
        {matterCountLabel(count)}
      </p>
    </header>
  );
}

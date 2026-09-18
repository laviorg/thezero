import Link from "next/link";

export type Crumb = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] tracking-wide text-muted uppercase">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="text-white/20" aria-hidden>
                  /
                </span>
              ) : null}
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-fg/80 normal-case tracking-normal" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

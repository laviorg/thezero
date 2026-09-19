import { cn } from "@/lib/utils";
import Link from "next/link";

export type Crumb = {
  href?: string;
  label: string;
};

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Trilha" className={cn("mb-5", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] tracking-wide text-muted uppercase">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const longTail = last && items.length > 2;
          return (
            <li
              key={`${item.label}-${index}`}
              /* A full headline in the trail wraps badly on phones. */
              className={
                longTail ? "hidden min-w-0 items-center gap-2 sm:flex" : "flex items-center gap-2"
              }
            >
              {index > 0 ? (
                <span className="text-hairline" aria-hidden>
                  /
                </span>
              ) : null}
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    last
                      ? "max-w-[46ch] truncate text-fg/80 normal-case tracking-normal"
                      : undefined
                  }
                >
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

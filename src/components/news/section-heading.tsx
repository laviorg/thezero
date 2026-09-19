import { cn } from "@/lib/utils";
import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  href?: string;
  actionLabel?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

export function SectionHeading({
  title,
  eyebrow,
  href,
  actionLabel = "Ver tudo",
  as: Title = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "section-heading flex items-end justify-between gap-3 border-b border-border pb-2.5",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="eyebrow page-kicker">
            {eyebrow}
          </p>
        ) : null}
        <Title
          id={id}
          className={cn(
            "font-display font-bold leading-tight tracking-tight text-pretty",
            eyebrow ? "mt-1 text-[1.15rem] sm:text-[1.35rem]" : "text-[1.15rem] sm:text-[1.35rem]",
          )}
        >
          {title}
        </Title>
      </div>
      {href ? (
        <Link
          href={href}
          className="hidden shrink-0 text-[0.8rem] font-medium tracking-[0.12em] text-accent uppercase transition-colors hover:text-fg sm:inline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

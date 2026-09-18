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
        "flex items-end justify-between gap-4 border-b border-white/10 pb-3",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[0.65rem] font-medium tracking-[0.2em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Title
          id={id}
          className={cn(
            "font-semibold tracking-tight text-pretty",
            eyebrow ? "mt-1 text-xl sm:text-2xl" : "text-xl sm:text-2xl",
          )}
        >
          {title}
        </Title>
      </div>
      {href ? (
        <Link
          href={href}
          className="hidden shrink-0 text-sm text-accent transition-colors hover:text-fg sm:inline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

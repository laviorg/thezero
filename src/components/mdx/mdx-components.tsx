import { WatermarkedPhoto } from "@/components/brand/photo-watermark";
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import Image from "next/image";

export function Verdict({
  overrated,
  underrated,
}: {
  overrated: string;
  underrated: string;
}) {
  return (
    <div className="my-10 grid gap-3 sm:grid-cols-2">
      <div className="border border-alert/50 bg-surface px-5 py-5">
        <p className="eyebrow text-alert">Overrated</p>
        <p className="font-display mt-2.5 text-[1.15rem] leading-snug font-semibold text-fg">
          {overrated}
        </p>
      </div>
      <div className="border-t-[3px] border-t-accent border border-accent/40 bg-accent-soft px-5 py-5">
        <p className="eyebrow page-kicker">Underrated</p>
        <p className="font-display mt-2.5 text-[1.15rem] leading-snug font-semibold text-fg">
          {underrated}
        </p>
      </div>
    </div>
  );
}

export function Rule({ children }: { children: ReactNode }) {
  return (
    <aside className="article-rule my-10 border-l-[5px] border-accent bg-accent-soft px-5 py-5">
      <p className="eyebrow page-kicker">Regra do The Zero</p>
      <div className="font-display mt-2.5 text-[1.2rem] leading-snug font-semibold text-fg">
        {children}
      </div>
    </aside>
  );
}

function MarkdownImage({
  src,
  alt,
}: ComponentPropsWithoutRef<"img">) {
  if (!src || typeof src !== "string") return null;

  return (
    <figure className="reveal-media my-8">
      <WatermarkedPhoto>
        <Image
          src={src}
          alt={alt && alt.trim().length > 0 ? alt : ""}
          width={1600}
          height={900}
          className="h-auto w-full"
          sizes="(min-width: 1024px) 42rem, 100vw"
        />
      </WatermarkedPhoto>
    </figure>
  );
}

export const mdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  Verdict,
  Rule,
  img: MarkdownImage,
  h2: ({ className, ...props }) => (
    <h2
      className={cn("article-h2", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("article-h3", className)}
      {...props}
    />
  ),
  p: ({ className, children, ...props }) => {
    const items = Children.toArray(children).filter((child) =>
      typeof child === "string" ? child.trim().length > 0 : true,
    );

    if (
      items.length === 1 &&
      isValidElement(items[0]) &&
      items[0].type === MarkdownImage
    ) {
      return items[0];
    }

    return (
      <p className={cn("article-p", className)} {...props}>
        {children}
      </p>
    );
  },
  table: ({ className, ...props }) => (
    <div className="my-7 overflow-x-auto border border-border">
      <table
        className={cn("w-full min-w-[28rem] text-left text-[0.98rem]", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead
      className={cn(
          "border-b border-border bg-surface text-[0.78rem] tracking-[0.14em] text-muted uppercase",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("px-4 py-3 font-medium", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-t border-border px-4 py-3 text-fg/90", className)}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("even:bg-fg/[0.03]", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("article-link", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-3.5 list-disc space-y-1.5 pl-5 leading-[1.72] sm:my-4",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-3.5 list-decimal space-y-1.5 pl-5 leading-[1.72] sm:my-4",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("pl-1", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("article-pullquote", className)}
      {...props}
    />
  ),
  cite: ({ className, ...props }) => (
    <cite className={cn("not-italic", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-fg", className)} {...props} />
  ),
  hr: () => <hr className="my-8 border-accent/25" />,
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto border border-border bg-surface p-4 font-mono text-sm leading-6 text-fg",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-accent",
        className,
      )}
      {...props}
    />
  ),
};

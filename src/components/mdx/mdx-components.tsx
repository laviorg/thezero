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
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      <div className="border border-alert/35 bg-surface p-5">
        <p className="text-[0.68rem] font-medium tracking-[0.2em] text-alert uppercase">
          Overrated
        </p>
        <p className="mt-3 text-lg leading-snug text-fg">{overrated}</p>
      </div>
      <div className="border border-accent/35 bg-surface p-5">
        <p className="text-[0.68rem] font-medium tracking-[0.2em] text-accent uppercase">
          Underrated
        </p>
        <p className="mt-3 text-lg leading-snug text-fg">{underrated}</p>
      </div>
    </div>
  );
}

export function Rule({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-surface px-5 py-4">
      <p className="text-[0.68rem] tracking-[0.2em] text-accent uppercase">
        Regra do The Zero
      </p>
      <div className="mt-2 text-base leading-relaxed text-fg">{children}</div>
    </aside>
  );
}

function MarkdownImage({
  src,
  alt,
}: ComponentPropsWithoutRef<"img">) {
  if (!src || typeof src !== "string") return null;

  return (
    <figure className="my-7">
      <WatermarkedPhoto>
        <Image
          src={src}
          alt={alt ?? ""}
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
      className={cn(
        "mt-10 mb-3 text-[clamp(1.25rem,2.5vw,1.7rem)] font-semibold tracking-tight leading-snug",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-7 mb-2.5 text-lg font-semibold tracking-tight",
        className,
      )}
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
      <p className={cn("my-4 leading-[1.75] sm:my-5", className)} {...props}>
        {children}
      </p>
    );
  },
  table: ({ className, ...props }) => (
    <div className="my-8 overflow-x-auto border border-white/10">
      <table
        className={cn("w-full min-w-[28rem] text-left text-base", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead
      className={cn(
        "border-b border-white/10 bg-surface text-sm tracking-wide text-muted uppercase",
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
      className={cn("border-t border-white/10 px-4 py-3 text-fg/90", className)}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("even:bg-white/[0.02]", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-4 list-disc space-y-2 pl-5 leading-[1.75] sm:my-5",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-4 list-decimal space-y-2 pl-5 leading-[1.75] sm:my-5",
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
      className={cn(
        "my-8 border-l-2 border-white/20 pl-5 text-xl leading-snug text-muted italic",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-fg", className)} {...props} />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto border border-white/10 bg-surface p-4 font-mono text-sm leading-6 text-fg",
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

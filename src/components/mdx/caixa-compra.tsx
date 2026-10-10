import type { ReactNode } from "react";

export function CaixaCompra({
  loja,
  href,
  produto,
  children,
}: {
  loja: string;
  href: string;
  produto: string;
  children?: ReactNode;
}) {
  const label = loja ? `ver preço na ${loja}` : "ver preço na loja";

  return (
    <aside className="caixa-compra my-8 min-w-0 border border-border bg-surface px-5 py-5">
      <p className="eyebrow page-kicker">Publicidade</p>
      <p className="font-display mt-2.5 text-[1.15rem] leading-snug font-bold text-fg">
        {produto}
      </p>
      {children ? (
        <div className="mt-3 text-[0.98rem] leading-6 text-fg/90">{children}</div>
      ) : null}
      <p className="mt-4">
        <a
          href={href}
          rel="sponsored nofollow"
          target="_blank"
          className="article-link"
        >
          {label}
        </a>
      </p>
    </aside>
  );
}

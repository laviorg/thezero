import { cn } from "@/lib/utils";
import { Children, type ReactNode } from "react";

/** Overrated/Underrated: 2 colunas (1 no celular), borda de 1px, fundo sutil. */
export function OverratedUnderrated({
  overrated,
  underrated,
}: {
  overrated: ReactNode;
  underrated: ReactNode;
}) {
  return (
    <div className="my-10 grid min-w-0 gap-3 sm:grid-cols-2">
      <div className="min-w-0 rounded-md border border-border bg-surface px-5 py-5">
        <p className="font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-amber-600 dark:text-amber-400">
          OVERRATED ↑
        </p>
        <p className="font-display mt-2.5 text-[1.12rem] leading-snug font-bold text-fg">
          {overrated}
        </p>
      </div>
      <div className="min-w-0 rounded-md border border-border bg-surface px-5 py-5">
        <p className="font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
          UNDERRATED ↓
        </p>
        <p className="font-display mt-2.5 text-[1.12rem] leading-snug font-bold text-fg">
          {underrated}
        </p>
      </div>
    </div>
  );
}

/** Regra do The Zero: borda esquerda de 4px, fundo de contraste, etiqueta mono. */
export function RegraDoTheZero({ children }: { children: ReactNode }) {
  return (
    <aside className="article-rule my-10 min-w-0 max-w-full border-l-4 border-accent bg-surface-raised px-5 py-5">
      <p className="font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-accent">
        REGRA DO THE ZERO
      </p>
      <div className="font-display mt-2.5 text-[1.15rem] leading-snug font-bold text-fg">
        {children}
      </div>
    </aside>
  );
}

/** Envolve uma tabela markdown: zebrada, números alinhados à direita. */
export function TabelaPreco({ children }: { children: ReactNode }) {
  return (
    <div className="tabela-preco tabular-nums [&_tbody_tr:nth-child(even)]:bg-surface-raised [&_td:not(:first-child)]:text-right [&_th:not(:first-child)]:text-right [&_td:not(:first-child)]:font-mono">
      {children}
    </div>
  );
}

/** Conta da redação: estilo terminal, fórmula e resultado (só dados do texto). */
export function ContaDaRedacao({
  formula,
  resultado,
  children,
}: {
  formula: string;
  resultado: string;
  children?: ReactNode;
}) {
  return (
    <figure className="my-8 min-w-0 overflow-x-auto rounded-md border border-border bg-[#0f141c] px-5 py-4 font-mono text-[0.9rem] text-[#d6e2f0] tabular-nums">
      <figcaption className="text-[0.68rem] tracking-[0.12em] text-[#8aa0b8]">
        CONTA DA REDAÇÃO
      </figcaption>
      <p className="mt-2 whitespace-pre-wrap">
        <span aria-hidden className="text-[#8aa0b8]">$ </span>
        {formula}
      </p>
      <p className="mt-1 font-semibold text-emerald-400">= {resultado}</p>
      {children ? (
        <div className="mt-2 text-[0.8rem] text-[#8aa0b8] [&_p]:m-0">{children}</div>
      ) : null}
    </figure>
  );
}

/** Fontes recolhidas: os links continuam no HTML (crawláveis), fechados por padrão. */
export function Fontes({
  count,
  children,
}: {
  count?: number | string;
  children: ReactNode;
}) {
  const n = Number(count) || Children.count(children);
  return (
    <details className={cn("fontes my-10 rounded-md border border-border bg-surface px-5 py-3")}>
      <summary className="cursor-pointer font-mono text-[0.78rem] font-semibold tracking-[0.06em] text-fg tabular-nums">
        Fontes primárias verificadas ({n}) ▾
      </summary>
      <div className="mt-3 text-[0.95rem]">{children}</div>
    </details>
  );
}
